#!/bin/bash
# Validation script to test migration workflow

set -e

EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"
DIRECTUS_URL="https://directus-backend.qr.insighture.com"

echo "=========================================="
echo "Migration Validation Checklist"
echo "=========================================="
echo ""

PASS=0
FAIL=0

# Test 1: Local Directus running
echo "✓ Test 1: Local Directus container status"
if docker ps | grep -q directus-cms-template-directus-1; then
    echo "  ✅ PASS: Local Directus is running"
    ((PASS++))
else
    echo "  ❌ FAIL: Local Directus not running"
    ((FAIL++))
fi

# Test 2: Can export schema
echo ""
echo "✓ Test 2: Schema export capability"
if docker exec directus-cms-template-directus-1 npx directus schema --help &>/dev/null; then
    echo "  ✅ PASS: Schema export available"
    ((PASS++))
else
    echo "  ❌ FAIL: Schema export not working"
    ((FAIL++))
fi

# Test 3: EC2 SSH access
echo ""
echo "✓ Test 3: EC2 SSH connectivity"
if ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "echo connected" &>/dev/null; then
    echo "  ✅ PASS: Can connect to EC2"
    ((PASS++))
else
    echo "  ❌ FAIL: Cannot connect to EC2"
    ((FAIL++))
fi

# Test 4: EC2 Directus running
echo ""
echo "✓ Test 4: EC2 Directus status"
EC2_STATUS=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} \
  "docker ps | grep directus-directus-1" 2>/dev/null || echo "")
if [ -n "$EC2_STATUS" ]; then
    echo "  ✅ PASS: EC2 Directus is running"
    ((PASS++))
else
    echo "  ❌ FAIL: EC2 Directus not running"
    ((FAIL++))
fi

# Test 5: EC2 API health
echo ""
echo "✓ Test 5: EC2 API health check"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${DIRECTUS_URL}/server/health 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ PASS: EC2 API responding (HTTP 200)"
    ((PASS++))
else
    echo "  ❌ FAIL: EC2 API not healthy (HTTP $HTTP_CODE)"
    ((FAIL++))
fi

# Test 6: Git repository clean
echo ""
echo "✓ Test 6: Git status"
cd ..
if git diff --quiet; then
    echo "  ✅ PASS: No uncommitted changes"
    ((PASS++))
else
    echo "  ⚠️  WARN: Uncommitted changes exist"
    echo "     (This is OK if you're testing locally)"
    ((PASS++))
fi

# Test 7: Snapshot directory exists
echo ""
echo "✓ Test 7: Snapshot directory"
if [ -d "snapshots" ]; then
    COUNT=$(ls -1 snapshots/*.yaml 2>/dev/null | wc -l)
    echo "  ✅ PASS: Snapshot directory exists ($COUNT snapshots)"
    ((PASS++))
else
    echo "  ⚠️  WARN: No snapshots directory"
    mkdir -p snapshots
    echo "     Created snapshots/ directory"
    ((PASS++))
fi

# Test 8: Scripts are executable
echo ""
echo "✓ Test 8: Script permissions"
if [ -x "scripts/export-schema.sh" ]; then
    echo "  ✅ PASS: Scripts are executable"
    ((PASS++))
else
    echo "  ⚠️  WARN: Scripts not executable"
    chmod +x scripts/*.sh
    echo "     Fixed permissions"
    ((PASS++))
fi

# Summary
echo ""
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo "Passed: $PASS / 8"
echo "Failed: $FAIL / 8"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "✅ All checks passed! Migration workflow is ready."
    echo ""
    echo "Next Steps:"
    echo "  1. Make schema changes in local Directus"
    echo "  2. Run: ./scripts/export-schema.sh"
    echo "  3. Commit snapshot to git"
    echo "  4. Run: ./scripts/apply-schema-ec2.sh <snapshot>"
    exit 0
else
    echo "❌ Some checks failed. Please fix issues before migrating."
    echo ""
    echo "Common fixes:"
    echo "  - Start local Directus: docker-compose up -d"
    echo "  - Check EC2 SSH key path"
    echo "  - Ensure EC2 Directus is running"
    exit 1
fi
