#!/bin/bash
# Apply SQL migration to EC2 RDS
set -e

EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"
RDS_HOST="insighture-directus.c9qm826agcm8.us-east-1.rds.amazonaws.com"
RDS_USER="postgres"
RDS_PASS="b0mtKDcNY59ys3kwbz5h"
RDS_DB="postgres"

echo "=========================================="
echo "EC2 Schema Migration - SQL Approach"
echo "=========================================="
echo ""
echo "This will add 44 new fields to EC2 without"
echo "affecting existing data or content."
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Step 1: Uploading SQL files to EC2..."
echo "-------------------------------------------"
scp -i "$SSH_KEY" \
    migration-ec2-add-fields.sql \
    migration-ec2-add-metadata.sql \
    ${EC2_USER}@${EC2_HOST}:~/

if [ $? -eq 0 ]; then
    echo "✓ SQL files uploaded"
else
    echo "✗ Upload failed!"
    exit 1
fi

echo ""
echo "Step 2: Running schema migration (adding columns)..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << EOF
    PGPASSWORD="$RDS_PASS" psql \
        -h $RDS_HOST \
        -U $RDS_USER \
        -d $RDS_DB \
        -f ~/migration-ec2-add-fields.sql

    if [ \$? -eq 0 ]; then
        echo "✓ Schema migration successful"
    else
        echo "✗ Schema migration failed!"
        exit 1
    fi
EOF

if [ $? -ne 0 ]; then
    echo "✗ Migration failed!"
    exit 1
fi

echo ""
echo "Step 3: Adding Directus metadata..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << EOF
    PGPASSWORD="$RDS_PASS" psql \
        -h $RDS_HOST \
        -U $RDS_USER \
        -d $RDS_DB \
        -f ~/migration-ec2-add-metadata.sql

    if [ \$? -eq 0 ]; then
        echo "✓ Metadata added successfully"
    else
        echo "✗ Metadata insertion failed!"
        exit 1
    fi
EOF

if [ $? -ne 0 ]; then
    echo "✗ Metadata failed!"
    exit 1
fi

echo ""
echo "Step 4: Restarting EC2 Directus..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << EOF
    cd ~/directus
    docker-compose restart

    echo "Waiting for Directus to start..."
    sleep 10

    # Check if container is running
    if docker ps | grep -q directus-directus-1; then
        echo "✓ Directus restarted successfully"
    else
        echo "✗ Directus failed to start!"
        docker logs directus-directus-1 --tail 50
        exit 1
    fi
EOF

if [ $? -ne 0 ]; then
    echo "✗ Restart failed!"
    exit 1
fi

echo ""
echo "Step 5: Validating API health..."
echo "-------------------------------------------"
sleep 5
HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" https://directus-backend.qr.insighture.com/server/health)

if [ "\$HTTP_CODE" = "200" ]; then
    echo "✓ API health check passed (HTTP 200)"
else
    echo "⚠️  API returned HTTP \$HTTP_CODE"
fi

echo ""
echo "Step 6: Cleaning up temporary files..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} "rm ~/migration-ec2-add-fields.sql ~/migration-ec2-add-metadata.sql"
echo "✓ Cleanup complete"

echo ""
echo "=========================================="
echo "Migration Complete!"
echo "=========================================="
echo ""
echo "✅ 44 fields added to EC2"
echo "✅ Directus metadata configured"
echo "✅ EC2 Directus restarted"
echo ""
echo "Next: You can now sync files to S3 if needed:"
echo "  ./sync-files-to-s3.sh"
echo ""
