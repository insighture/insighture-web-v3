#!/bin/bash
# Schema comparison script: Local vs EC2

TABLES=(
"block_button"
"block_button_group"
"block_card_grid"
"block_card_grid_item"
"block_credentials"
"block_credentials_badge"
"block_feature_split"
"block_feature_split_item"
"block_form"
"block_gallery"
"block_gallery_items"
"block_hero"
"block_hero_headline_line"
"block_hero_slide"
"block_insights"
"block_logo_carousel"
"block_logo_carousel_item"
"block_posts"
"block_pricing"
"block_pricing_cards"
"block_richtext"
"block_services"
"block_services_item"
"block_testimonials"
"block_testimonials_item"
"block_testimonials_stat"
)

echo "==================================="
echo "Schema Comparison: Local vs EC2"
echo "==================================="
echo ""

MISSING_FIELDS=()

for TABLE in "${TABLES[@]}"; do
    echo "Checking: $TABLE"

    # Get local columns
    LOCAL_COLS=$(docker exec directus-cms-template-database-1 psql -U directus directus -t -A -c "SELECT column_name FROM information_schema.columns WHERE table_name = '$TABLE' ORDER BY ordinal_position;" | tr '\n' '|')

    # Get EC2 columns
    EC2_COLS=$(ssh -i "c:\Users\HP\Downloads\directus-keys.pem" -o StrictHostKeyChecking=no ec2-user@ec2-54-160-149-229.compute-1.amazonaws.com "PGPASSWORD='b0mtKDcNY59ys3kwbz5h' psql -h insighture-directus.c9qm826agcm8.us-east-1.rds.amazonaws.com -U postgres -d postgres -t -A -c \"SELECT column_name FROM information_schema.columns WHERE table_name = '$TABLE' ORDER BY ordinal_position;\" 2>/dev/null" | tr '\n' '|')

    # Compare
    IFS='|' read -ra LOCAL_ARR <<< "$LOCAL_COLS"
    IFS='|' read -ra EC2_ARR <<< "$EC2_COLS"

    DIFF_FOUND=0
    for COL in "${LOCAL_ARR[@]}"; do
        if [[ -n "$COL" ]] && [[ ! " ${EC2_ARR[@]} " =~ " ${COL} " ]]; then
            echo "  ❌ MISSING: $COL"
            MISSING_FIELDS+=("$TABLE.$COL")
            DIFF_FOUND=1
        fi
    done

    if [ $DIFF_FOUND -eq 0 ]; then
        echo "  ✅ Schema match"
    fi
    echo ""
done

echo "==================================="
echo "Summary"
echo "==================================="
if [ ${#MISSING_FIELDS[@]} -eq 0 ]; then
    echo "✅ All schemas match!"
else
    echo "❌ Found ${#MISSING_FIELDS[@]} missing fields:"
    for FIELD in "${MISSING_FIELDS[@]}"; do
        echo "  - $FIELD"
    done
fi
