# Directus Migration Scripts

Helper scripts for managing Directus schema migrations between local and EC2.

## Available Scripts

### `export-schema.sh`

**Purpose:** Export current local Directus schema to a snapshot file

**Usage:**
```bash
./export-schema.sh
```

**Output:**
- Creates `snapshots/schema-YYYYMMDD-HHMMSS.yaml`
- Creates symlink `snapshots/schema-latest.yaml`

**When to use:**
- After making schema changes locally
- Before committing schema to git
- When preparing to deploy to EC2

---

### `apply-schema-ec2.sh`

**Purpose:** Apply a schema snapshot to EC2 Directus

**Usage:**
```bash
./apply-schema-ec2.sh schema-20260304-141500.yaml
```

**What it does:**
1. Uploads snapshot to EC2
2. Applies schema via Directus CLI
3. Restarts Directus
4. Validates deployment

**When to use:**
- After pushing schema snapshot to git
- When deploying schema changes to production
- When syncing EC2 with local schema

---

### `sync-to-ec2.sh`

**Purpose:** Complete workflow - export → commit → deploy

**Usage:**
```bash
./sync-to-ec2.sh
```

**What it does:**
1. Exports local schema
2. Commits to git
3. (Optional) Pushes to remote
4. (Optional) Applies to EC2

**When to use:**
- Quick one-command deployment
- When you want guided workflow
- Regular sync operations

---

### `compare-schemas.sh`

**Purpose:** Compare schemas between local and EC2

**Usage:**
```bash
./compare-schemas.sh
```

**Output:**
- Lists missing fields/columns
- Shows schema drift
- Identifies sync issues

**When to use:**
- Troubleshooting 403 errors
- After manual DB changes
- Before major deployments
- Regular health checks

---

## Typical Workflow

### Making Schema Changes

```bash
# 1. Make changes in local Directus UI (http://localhost:8055)

# 2. Export schema
cd directus/scripts
./export-schema.sh

# 3. Review the snapshot
cat ../snapshots/schema-latest.yaml

# 4. Commit to git
cd ..
git add snapshots/schema-*.yaml
git commit -m "feat: add color field to block_hero_headline_line"
git push

# 5. Apply to EC2
cd scripts
./apply-schema-ec2.sh schema-20260304-141500.yaml
```

### Quick Sync (All Steps)

```bash
cd directus/scripts
./sync-to-ec2.sh
# Follow prompts
```

### Checking Schema Health

```bash
cd directus/scripts
./compare-schemas.sh
# Review any missing fields
```

---

## Troubleshooting

### "Snapshot creation failed"
- Check if Directus container is running: `docker ps`
- Start container: `cd directus && docker-compose up -d`
- Check logs: `docker logs directus-cms-template-directus-1`

### "Permission denied"
- Make scripts executable: `chmod +x *.sh`

### "SSH key not found"
- Update `SSH_KEY` path in scripts
- Ensure key is at: `c:/Users/HP/Downloads/directus-keys.pem`

### "Schema apply failed on EC2"
- Check EC2 Directus logs: `ssh ec2 "docker logs directus-directus-1"`
- Verify snapshot file integrity
- Ensure EC2 Directus version matches local

---

## Best Practices

1. **Always export after changes** - Don't forget to snapshot!
2. **Test locally first** - Never apply untested schemas to EC2
3. **Commit before applying** - Git is your rollback mechanism
4. **Use compare-schemas.sh** - Regular health checks prevent drift
5. **Coordinate with team** - Avoid concurrent schema changes

---

## Related Documentation

- [MIGRATION_WORKFLOW.md](../MIGRATION_WORKFLOW.md) - Complete migration guide
- [SCHEMA_SYNC_GUIDE.md](../SCHEMA_SYNC_GUIDE.md) - Manual schema sync procedures
