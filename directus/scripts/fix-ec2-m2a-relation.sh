#!/bin/bash
# Fix M2A relation on EC2 to include EC2 blocks

echo "=== Installing PostgreSQL client ==="
sudo yum install -y postgresql15

echo ""
echo "=== Getting database credentials ==="
DB_PASS=$(docker exec directus-directus-1 sh -c 'echo $DB_PASSWORD')
DB_HOST=$(docker exec directus-directus-1 sh -c 'echo $DB_HOST')
DB_USER=$(docker exec directus-directus-1 sh -c 'echo $DB_USER')
DB_NAME=$(docker exec directus-directus-1 sh -c 'echo $DB_DATABASE')

echo "Database: $DB_HOST"
echo ""

echo "=== Creating SQL fix ==="
cat > /tmp/fix_m2a_relation.sql << 'EOF'
UPDATE directus_relations
SET one_allowed_collections = ARRAY[
    'block_hero',
    'block_richtext',
    'block_form',
    'block_posts',
    'block_gallery',
    'block_pricing',
    'block_services',
    'block_testimonials',
    'block_logo_carousel',
    'block_feature_split',
    'block_insights',
    'block_credentials',
    'block_card_grid',
    'block_featured_post',
    'block_posts_carousel',
    'block_all_posts',
    'block_services_tab',
    'block_reach_out'
]
WHERE many_collection = 'page_blocks'
  AND many_field = 'item'
  AND one_collection IS NULL
  AND one_collection_field = 'collection';

SELECT 'Updated: ' || array_length(one_allowed_collections, 1) || ' blocks in M2A relation' as status
FROM directus_relations
WHERE many_collection = 'page_blocks'
  AND many_field = 'item'
  AND one_collection IS NULL;
EOF

echo "=== Applying SQL fix to RDS ==="
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /tmp/fix_m2a_relation.sql

echo ""
echo "=== Restarting Directus container ==="
docker restart directus-directus-1

echo ""
echo "=== Waiting for Directus to start ==="
sleep 10

echo ""
echo "=== Checking container status ==="
docker ps | grep directus

echo ""
echo "✅ Done! Please open Directus admin in a fresh incognito window:"
echo "   http://ec2-54-160-149-229.compute-1.amazonaws.com"
echo ""
echo "   Login: admin@insighture.com / insdlr3ctu5"
echo ""
echo "   Check 'Our Thinking' page - the Invalid Items should now show as proper blocks!"
