#!/bin/bash
# Apply Directus schema snapshot to EC2 instance

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <snapshot-file>"
    echo "Example: $0 schema-20260304-141500.yaml"
    echo ""
    echo "Available snapshots:"
    ls -1 ../snapshots/*.yaml 2>/dev/null | xargs -n1 basename || echo "  (none found)"
    exit 1
fi

SNAPSHOT_FILE="$1"
EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"

echo "=========================================="
echo "Applying Schema to EC2 Directus"
echo "=========================================="
echo ""
echo "Snapshot: $SNAPSHOT_FILE"
echo "EC2 Host: $EC2_HOST"
echo ""

# Check if snapshot exists
if [ ! -f "../snapshots/$SNAPSHOT_FILE" ]; then
    echo "❌ Error: Snapshot file not found: ../snapshots/$SNAPSHOT_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will modify the EC2 Directus schema!"
echo "⚠️  Make sure you've:"
echo "   - Tested the snapshot locally"
echo "   - Committed the snapshot to git"
echo "   - Coordinated with your team"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Step 1: Uploading snapshot to EC2..."
echo "-------------------------------------------"
scp -i "$SSH_KEY" "../snapshots/$SNAPSHOT_FILE" ${EC2_USER}@${EC2_HOST}:~/directus/snapshots/

if [ $? -eq 0 ]; then
    echo "✓ Snapshot uploaded"
else
    echo "✗ Upload failed!"
    exit 1
fi

echo ""
echo "Step 2: Applying schema snapshot..."
echo "-------------------------------------------"
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << EOF
    echo "Applying schema..."
    cd ~/directus
    docker exec directus-directus-1 \
      npx directus schema apply /directus/snapshots/$SNAPSHOT_FILE

    if [ \$? -eq 0 ]; then
        echo ""
        echo "✓ Schema applied successfully!"
        echo "Restarting Directus..."
        docker-compose restart
        echo "✓ Directus restarted"

        # Wait for startup
        echo "Waiting for Directus to initialize (30s)..."
        sleep 30

        echo ""
        echo "Checking logs for errors..."
        docker logs directus-directus-1 --tail 20 2>&1 | grep -i error || echo "No errors found"
    else
        echo "✗ Schema apply failed!"
        echo ""
        echo "Check logs:"
        docker logs directus-directus-1 --tail 50
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Migration Completed Successfully!"
    echo "=========================================="
    echo ""
    echo "Directus is available at:"
    echo "  https://directus-backend.qr.insighture.com"
    echo ""
    echo "Next Steps:"
    echo "  1. Test API endpoints"
    echo "  2. Check frontend (https://develop.d13cqpuwmpw5dw.amplifyapp.com)"
    echo "  3. Monitor logs for issues"
    echo ""
else
    echo "✗ Migration failed!"
    echo "The EC2 Directus may need manual intervention."
    exit 1
fi
