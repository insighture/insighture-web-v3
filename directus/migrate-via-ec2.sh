#!/bin/bash
# Migration script via EC2 instance (recommended for RDS security)

set -e

echo "=========================================="
echo "Directus Migration via EC2 Instance"
echo "=========================================="
echo ""

# Configuration
LOCAL_CONTAINER="directus-cms-template-database-1"
LOCAL_DB="directus"
LOCAL_USER="directus"
EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"

# Export file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_FILE="directus_migration_${TIMESTAMP}.sql"

echo "Step 1: Exporting local Directus database..."
echo "-------------------------------------------"
docker exec $LOCAL_CONTAINER pg_dump \
  -U $LOCAL_USER \
  $LOCAL_DB \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  > "$EXPORT_FILE"

if [ $? -eq 0 ]; then
    FILE_SIZE=$(du -h "$EXPORT_FILE" | cut -f1)
    echo "✓ Export successful: $EXPORT_FILE"
    echo "  File size: $FILE_SIZE"
else
    echo "✗ Export failed!"
    exit 1
fi

echo ""
echo "Step 2: Uploading to EC2 instance..."
echo "-------------------------------------------"
scp "$EXPORT_FILE" ${EC2_USER}@${EC2_HOST}:~/

if [ $? -eq 0 ]; then
    echo "✓ Upload successful"
else
    echo "✗ Upload failed!"
    exit 1
fi

echo ""
echo "Step 3: Importing to RDS via EC2..."
echo "-------------------------------------------"
echo "⚠️  WARNING: This will replace all data in the EC2 RDS database!"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled."
    echo "Export file saved locally: $EXPORT_FILE"
    echo "Export file uploaded to EC2: ~/$EXPORT_FILE"
    exit 0
fi

echo ""
echo "Running import on EC2..."
ssh ${EC2_USER}@${EC2_HOST} << EOF
    echo "Importing database..."
    PGPASSWORD="b0mtKDcNY59ys3kwbz5h" psql \
      -h insighture-directus.c9qm826agcm8.us-east-1.rds.amazonaws.com \
      -U postgres \
      -d postgres \
      -f ~/$EXPORT_FILE

    if [ \$? -eq 0 ]; then
        echo ""
        echo "✓ Import successful!"
        echo "Restarting Directus..."
        cd ~/directus
        docker-compose restart
        echo "✓ Directus restarted"

        # Clean up
        rm ~/$EXPORT_FILE
        echo "✓ Cleaned up temporary file"
    else
        echo "✗ Import failed!"
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Migration completed successfully!"
    echo "=========================================="
    echo ""
    echo "Directus is now available at:"
    echo "  http://ec2-54-160-149-229.compute-1.amazonaws.com"
    echo ""
    echo "Login credentials:"
    echo "  Email: admin@insighture.com"
    echo "  Password: insdlr3ctu5"
    echo ""
    echo "Local export saved: $EXPORT_FILE"
else
    echo "✗ Migration failed!"
    echo "Export file saved locally: $EXPORT_FILE"
    exit 1
fi
