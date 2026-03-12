# PowerShell migration script via EC2 instance (recommended for RDS security)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Directus Migration via EC2 Instance" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$LOCAL_CONTAINER = "directus-cms-template-database-1"
$LOCAL_DB = "directus"
$LOCAL_USER = "directus"
$EC2_HOST = "54.160.149.229"
$EC2_USER = "ec2-user"

# Export file
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$EXPORT_FILE = "directus_migration_$timestamp.sql"

Write-Host "Step 1: Exporting local Directus database..." -ForegroundColor Yellow
Write-Host "-------------------------------------------"

docker exec $LOCAL_CONTAINER pg_dump -U $LOCAL_USER $LOCAL_DB --clean --if-exists --no-owner --no-privileges | Out-File -FilePath $EXPORT_FILE -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    $fileSize = (Get-Item $EXPORT_FILE).Length / 1MB
    Write-Host "✓ Export successful: $EXPORT_FILE" -ForegroundColor Green
    Write-Host "  File size: $([math]::Round($fileSize, 2)) MB"
} else {
    Write-Host "✗ Export failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Uploading to EC2 instance..." -ForegroundColor Yellow
Write-Host "-------------------------------------------"

scp $EXPORT_FILE "${EC2_USER}@${EC2_HOST}:~/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Upload successful" -ForegroundColor Green
} else {
    Write-Host "✗ Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Importing to RDS via EC2..." -ForegroundColor Yellow
Write-Host "-------------------------------------------"
Write-Host "⚠️  WARNING: This will replace all data in the EC2 RDS database!" -ForegroundColor Red
Write-Host ""
$confirm = Read-Host "Do you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Migration cancelled." -ForegroundColor Yellow
    Write-Host "Export file saved locally: $EXPORT_FILE"
    Write-Host "Export file uploaded to EC2: ~/$EXPORT_FILE"
    exit 0
}

Write-Host ""
Write-Host "Running import on EC2..."

$importScript = @"
echo 'Importing database...'
PGPASSWORD='b0mtKDcNY59ys3kwbz5h' psql \
  -h insighture-directus.c9qm826agcm8.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d postgres \
  -f ~/$EXPORT_FILE

if [ `$? -eq 0 ]; then
    echo ''
    echo '✓ Import successful!'
    echo 'Restarting Directus...'
    cd ~/directus
    docker-compose restart
    echo '✓ Directus restarted'

    # Clean up
    rm ~/$EXPORT_FILE
    echo '✓ Cleaned up temporary file'
    exit 0
else
    echo '✗ Import failed!'
    exit 1
fi
"@

ssh "${EC2_USER}@${EC2_HOST}" $importScript

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Migration completed successfully!" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Directus is now available at:"
    Write-Host "  http://ec2-54-160-149-229.compute-1.amazonaws.com"
    Write-Host ""
    Write-Host "Login credentials:"
    Write-Host "  Email: admin@insighture.com"
    Write-Host "  Password: insdlr3ctu5"
    Write-Host ""
    Write-Host "Local export saved: $EXPORT_FILE"
} else {
    Write-Host "✗ Migration failed!" -ForegroundColor Red
    Write-Host "Export file saved locally: $EXPORT_FILE"
    exit 1
}
