# Directus Migration Workflow

## Overview

This document outlines the proper workflow for managing Directus schema and content migrations between local development and EC2 production environments.

## Migration Architecture

### What Gets Migrated

1. **Schema (Version Controlled)**
   - Collections definitions
   - Fields metadata
   - Relations
   - Roles & Permissions
   - **Tool:** Directus Schema Snapshot/Apply

2. **Content/Data (Selective)**
   - Pages, blocks, posts
   - **Tool:** Database dumps (pg_dump/pg_restore)
   - **Note:** Usually keep dev and prod data separate

3. **Files/Assets**
   - Local: Local storage (`./uploads`)
   - EC2: S3 storage (`insighture-directus` bucket)
   - **Migration:** AWS S3 sync or keep separate

4. **Extensions**
   - Git-tracked in `directus/extensions/`
   - Synced via git pull
   - **Note:** Some extensions in EC2 may differ

---

## Multi-Developer Workflow

### Local Development Setup

Each developer runs:
```bash
cd directus
docker-compose up -d
```

- Local Directus: http://localhost:8055
- Local PostgreSQL via Docker
- Local file storage

### Making Schema Changes

**Step 1: Make changes in Directus UI**
- Add/modify collections, fields, relations locally
- Test thoroughly in local environment

**Step 2: Export schema snapshot**
```bash
# From directus/ directory
docker exec directus-cms-template-directus-1 \
  npx directus schema snapshot \
  /directus/schema-$(date +%Y%m%d).yaml

# Copy to host
docker cp directus-cms-template-directus-1:/directus/schema-YYYYMMDD.yaml \
  ./snapshots/schema-YYYYMMDD.yaml
```

**Alternative (simpler):** Use provided script:
```bash
./scripts/export-schema.sh
```

**Step 3: Commit to Git**
```bash
git add snapshots/schema-YYYYMMDD.yaml
git commit -m "feat: add new field to block_hero"
git push
```

### Applying Schema to EC2

**Step 1: SSH to EC2**
```bash
ssh -i "c:\Users\HP\Downloads\directus-keys.pem" \
  ec2-user@ec2-54-160-149-229.compute-1.amazonaws.com
```

**Step 2: Pull latest code**
```bash
cd ~/directus
git pull origin main
```

**Step 3: Apply schema snapshot**
```bash
docker exec directus-directus-1 \
  npx directus schema apply /directus/snapshots/schema-YYYYMMDD.yaml
```

**Step 4: Restart Directus**
```bash
docker-compose restart
```

**Step 5: Validate**
```bash
# Check logs for errors
docker logs directus-directus-1 --tail 50

# Test API endpoint
curl https://directus-backend.qr.insighture.com/server/health
```

---

## Content Migration (When Needed)

### Local → EC2 Data Migration

⚠️ **WARNING:** This replaces ALL production data! Only use when:
- Initial setup
- Major content overhaul approved
- Restoring from backup

**Export from local:**
```bash
cd directus
docker exec directus-cms-template-database-1 \
  pg_dump -U directus directus \
  --clean --if-exists --no-owner --no-privileges \
  > migration_$(date +%Y%m%d).sql
```

**Import to EC2** (via existing script):
```bash
./migrate-via-ec2.sh
```

This script:
1. Exports local DB
2. Uploads to EC2
3. Imports to RDS via EC2 tunnel
4. Restarts Directus
5. Updates admin credentials

**After data migration:**
- Schema metadata may be outdated
- Run schema diff check
- Apply latest schema snapshot
- Test all API endpoints

---

## File Storage Migration

### S3 Sync (if needed)

**Upload local files to EC2 S3:**
```bash
# From directus/uploads/ directory
aws s3 sync ./uploads/ s3://insighture-directus/ \
  --exclude ".*" \
  --acl private
```

**Download EC2 files to local:**
```bash
# To directus/uploads/
aws s3 sync s3://insighture-directus/ ./uploads/ \
  --exclude ".*"
```

**Recommendation:** Keep dev and prod files separate
- Local: Use local storage with test images
- EC2: Production assets in S3
- Don't sync unless specifically needed

---

## Extension Management

### Installing Extensions

**Local:**
```bash
cd directus/extensions
npm install <extension-name>
# or manually place in extensions/
docker-compose restart
```

**EC2:**
```bash
ssh ec2-user@ec2-...
cd ~/directus/extensions
npm install <extension-name>
docker-compose restart
```

**Git Tracking:**
- Extensions code: tracked in `extensions/`
- Extension configs: included in schema snapshots
- node_modules: ignored (.gitignore)

---

## Testing Pipeline

### Recommended Flow

```
┌─────────────┐
│   Local     │ ← Developer makes changes
│ Development │ ← Exports schema snapshot
└──────┬──────┘ ← Commits to feature branch
       │
       ▼
┌─────────────┐
│   GitHub    │ ← Code review
│   PR/Merge  │ ← Team approval
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ EC2 Staging │ ← Pull + apply snapshot
│  (Optional) │ ← Test before production
└──────┬──────┘
       │
       ▼
┌─────────────┐
│EC2 Production│ ← Apply to production
│ (Current)   │ ← Monitor logs
└─────────────┘
```

### Testing Checklist

**Before Committing:**
- [ ] Schema changes work locally
- [ ] Next.js frontend renders correctly
- [ ] API queries return expected data
- [ ] No console errors

**Before EC2 Deployment:**
- [ ] Schema snapshot committed
- [ ] PR reviewed and approved
- [ ] Backup EC2 database (optional)
- [ ] Maintenance window scheduled (if major)

**After EC2 Deployment:**
- [ ] Schema applied successfully
- [ ] Directus starts without errors
- [ ] API health check passes
- [ ] Frontend loads correctly
- [ ] Test critical user flows

---

## Common Issues

### Schema Drift

**Problem:** Local and EC2 schemas don't match

**Symptoms:**
- 403 Forbidden errors for fields
- "Field does not exist" errors
- Missing collections

**Solution:**
```bash
# Generate diff report
./scripts/compare-schemas.sh

# Apply latest snapshot to EC2
ssh ec2 "cd ~/directus && \
  docker exec directus-directus-1 \
  npx directus schema apply /directus/snapshots/schema-latest.yaml"
```

### Manual SQL Changes

**Problem:** Someone ran manual SQL on EC2

**Impact:** Schema snapshots won't capture manual changes

**Solution:**
1. Export EC2 schema snapshot
2. Apply to local
3. Regenerate snapshot from local
4. Commit to git as source of truth

### Extension Conflicts

**Problem:** Extension versions differ between local and EC2

**Solution:**
- Use `package.json` to lock versions
- Document required extensions
- Test extensions locally before EC2

---

## Quick Reference

### Export Schema (Local)
```bash
docker exec directus-cms-template-directus-1 \
  npx directus schema snapshot /directus/schema.yaml
docker cp directus-cms-template-directus-1:/directus/schema.yaml ./snapshots/
```

### Apply Schema (EC2)
```bash
ssh ec2 "docker exec directus-directus-1 \
  npx directus schema apply /directus/snapshots/schema.yaml"
```

### Full Data Migration
```bash
./migrate-via-ec2.sh
```

### Schema Diff Check
```bash
./compare-schemas.sh
```

---

## Best Practices

1. **Always work locally first** - Test changes before EC2
2. **Use schema snapshots** - Never manual SQL for schema changes
3. **Commit snapshots to git** - Version control for schema
4. **Keep content separate** - Dev data ≠ production data
5. **Document major changes** - Update this file when workflow changes
6. **Coordinate with team** - Avoid concurrent schema changes
7. **Test before deploying** - Use staging or local testing
8. **Monitor after deploy** - Check logs and frontend immediately

---

## Team Communication

### Before Schema Changes
- Announce in team chat: "Working on block_hero schema"
- Check if others are modifying related collections
- Coordinate timing if multiple migrations needed

### After Schema Changes
- Push to feature branch first
- Request PR review
- Announce deployment: "Deploying schema update at 3pm"
- Share snapshot filename in commit message

### Emergency Rollback
If schema breaks production:
```bash
# Revert to previous snapshot
ssh ec2 "docker exec directus-directus-1 \
  npx directus schema apply /directus/snapshots/schema-PREVIOUS.yaml"
```

---

## Future Improvements

- [ ] CI/CD pipeline for automatic schema apply
- [ ] Staging environment for pre-production testing
- [ ] Automated schema diff checks in PR
- [ ] Migration scripts for data transformations
- [ ] Rollback automation
