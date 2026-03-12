#!/bin/bash
# Sync local Directus files to EC2 S3 bucket

set -e

LOCAL_UPLOADS="./uploads"
S3_BUCKET="s3://insighture-directus"
EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"

echo "=========================================="
echo "Syncing Local Files to EC2 S3"
echo "=========================================="
echo ""

# Check if local uploads directory exists
if [ ! -d "$LOCAL_UPLOADS" ]; then
    echo "❌ Error: Local uploads directory not found: $LOCAL_UPLOADS"
    exit 1
fi

# Count local files
LOCAL_COUNT=$(find "$LOCAL_UPLOADS" -type f ! -name '.gitkeep' | wc -l)
echo "Local files found: $LOCAL_COUNT"
echo ""

echo "⚠️  WARNING: This will upload all local files to S3!"
echo "   S3 Bucket: $S3_BUCKET"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Step 1: Creating temporary archive..."
echo "-------------------------------------------"
cd uploads
tar -czf ../uploads-sync.tar.gz --exclude='.gitkeep' .
cd ..

if [ -f "uploads-sync.tar.gz" ]; then
    FILE_SIZE=$(du -h uploads-sync.tar.gz | cut -f1)
    echo "✓ Archive created: uploads-sync.tar.gz ($FILE_SIZE)"
else
    echo "✗ Archive creation failed!"
    exit 1
fi

echo ""
echo "Step 2: Uploading to EC2..."
echo "-------------------------------------------"
scp -i "$SSH_KEY" uploads-sync.tar.gz ${EC2_USER}@${EC2_HOST}:~/

if [ $? -eq 0 ]; then
    echo "✓ Archive uploaded to EC2"
else
    echo "✗ Upload failed!"
    rm -f uploads-sync.tar.gz
    exit 1
fi

echo ""
echo "Step 3: Extracting and syncing to S3..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << 'EOF'
    echo "Extracting archive..."
    mkdir -p ~/temp-uploads
    tar -xzf ~/uploads-sync.tar.gz -C ~/temp-uploads

    echo "Syncing to S3..."
    aws s3 sync ~/temp-uploads/ s3://insighture-directus/ \
        --exclude ".*" \
        --storage-class STANDARD

    if [ $? -eq 0 ]; then
        echo "✓ Files synced to S3"

        # Count files in S3
        S3_COUNT=$(aws s3 ls s3://insighture-directus/ --recursive | wc -l)
        echo "Total files in S3: $S3_COUNT"

        # Cleanup
        rm -rf ~/temp-uploads ~/uploads-sync.tar.gz
        echo "✓ Cleaned up temporary files"
    else
        echo "✗ S3 sync failed!"
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "Step 4: Restarting Directus..."
    echo "-------------------------------------------"
    ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} "cd ~/directus && docker-compose restart"

    echo ""
    echo "=========================================="
    echo "File Sync Complete!"
    echo "=========================================="
    echo ""
    echo "Your images should now be accessible in EC2 Directus."
    echo ""
    echo "Cleaning up local archive..."
    rm -f uploads-sync.tar.gz
    echo "✓ Done"
else
    echo "✗ Sync failed!"
    rm -f uploads-sync.tar.gz
    exit 1
fi
