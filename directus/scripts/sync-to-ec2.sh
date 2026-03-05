#!/bin/bash
# Complete workflow: Export local schema → Commit to git → Apply to EC2

set -e

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SNAPSHOT_FILE="schema-${TIMESTAMP}.yaml"

echo "=========================================="
echo "Complete Schema Sync: Local → EC2"
echo "=========================================="
echo ""

# Step 1: Export local schema
echo "Step 1: Exporting local schema..."
echo "-------------------------------------------"
./export-schema.sh

if [ $? -ne 0 ]; then
    echo "✗ Schema export failed!"
    exit 1
fi

# Step 2: Git operations
echo ""
echo "Step 2: Git operations..."
echo "-------------------------------------------"
cd ..
git add snapshots/$SNAPSHOT_FILE snapshots/schema-latest.yaml

echo "Enter commit message (or press Enter for default):"
read -p "Message: " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="schema: update snapshot ${TIMESTAMP}"
fi

git commit -m "$COMMIT_MSG"

echo "✓ Changes committed"
echo ""
echo "Push to remote? (yes/no)"
read -p "Push: " PUSH_CONFIRM

if [ "$PUSH_CONFIRM" == "yes" ]; then
    git push
    echo "✓ Pushed to remote"
fi

# Step 3: Apply to EC2
echo ""
echo "Step 3: Apply to EC2..."
echo "-------------------------------------------"
echo "Apply schema snapshot to EC2 now? (yes/no)"
read -p "Apply: " APPLY_CONFIRM

if [ "$APPLY_CONFIRM" == "yes" ]; then
    cd scripts
    ./apply-schema-ec2.sh $SNAPSHOT_FILE
else
    echo ""
    echo "Skipped EC2 apply. To apply later, run:"
    echo "  ./scripts/apply-schema-ec2.sh $SNAPSHOT_FILE"
fi

echo ""
echo "=========================================="
echo "Sync Complete!"
echo "=========================================="
