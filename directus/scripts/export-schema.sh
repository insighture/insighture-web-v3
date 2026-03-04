#!/bin/bash
# Export Directus schema snapshot from local instance

set -e

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SNAPSHOT_FILE="schema-${TIMESTAMP}.yaml"
CONTAINER="directus-cms-template-directus-1"

echo "=========================================="
echo "Exporting Directus Schema Snapshot"
echo "=========================================="
echo ""

# Check if container is running
if ! docker ps | grep -q $CONTAINER; then
    echo "❌ Error: Directus container '$CONTAINER' is not running"
    echo "   Run: docker-compose up -d"
    exit 1
fi

echo "Step 1: Creating schema snapshot..."
echo "-------------------------------------------"
docker exec $CONTAINER npx directus schema snapshot "/directus/${SNAPSHOT_FILE}"

if [ $? -eq 0 ]; then
    echo "✓ Snapshot created in container"
else
    echo "✗ Snapshot creation failed!"
    exit 1
fi

echo ""
echo "Step 2: Copying snapshot to host..."
echo "-------------------------------------------"

# Create snapshots directory if it doesn't exist
mkdir -p ../snapshots

# Copy from container to host
docker cp "${CONTAINER}:${SNAPSHOT_FILE}" "../snapshots/${SNAPSHOT_FILE}" 2>/dev/null || \
docker exec $CONTAINER cat "/${SNAPSHOT_FILE}" > "../snapshots/${SNAPSHOT_FILE}"

if [ -f "../snapshots/${SNAPSHOT_FILE}" ]; then
    FILE_SIZE=$(du -h "../snapshots/${SNAPSHOT_FILE}" | cut -f1)
    echo "✓ Snapshot saved: snapshots/${SNAPSHOT_FILE}"
    echo "  File size: ${FILE_SIZE}"
else
    echo "✗ Failed to copy snapshot to host"
    exit 1
fi

echo ""
echo "Step 3: Creating 'latest' symlink..."
echo "-------------------------------------------"
cd ../snapshots
rm -f schema-latest.yaml
ln -s "${SNAPSHOT_FILE}" schema-latest.yaml || cp "${SNAPSHOT_FILE}" schema-latest.yaml
echo "✓ Symlink created: schema-latest.yaml -> ${SNAPSHOT_FILE}"

echo ""
echo "=========================================="
echo "Export Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "  1. Review the snapshot file"
echo "  2. Commit to git:"
echo "     git add snapshots/${SNAPSHOT_FILE}"
echo "     git commit -m \"schema: update snapshot\""
echo "     git push"
echo ""
echo "  3. Apply to EC2:"
echo "     ./scripts/apply-schema-ec2.sh ${SNAPSHOT_FILE}"
echo ""
