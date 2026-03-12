#!/bin/bash
# Restore EC2-only pages and blocks via Directus API
set -e

EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"
API_URL="http://localhost"

echo "=========================================="
echo "Restoring EC2-Only Pages and Blocks"
echo "=========================================="
echo ""

# Upload backup files to EC2
echo "Step 1: Uploading backup files to EC2..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
    ec2-backup/ec2-block_hero.json \
    ec2-backup/ec2-block_hero_headline_line.json \
    ec2-backup/ec2-block_services_tab.json \
    ec2-backup/ec2-block_all_posts.json \
    ec2-backup/ec2-block_featured_post.json \
    ec2-backup/ec2-block_posts_carousel.json \
    ec2-backup/ec2-block_service_panel.json \
    ec2-backup/ec2-block_expertise_cards.json \
    ${EC2_USER}@${EC2_HOST}:/tmp/

echo "✓ Backup files uploaded"
echo ""

echo "Step 2: Restoring pages and blocks via API..."
ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
API_URL="http://localhost"

# Restore "Our Thinking" page
echo "Restoring 'Our Thinking' page..."
curl -s -X POST "$API_URL/items/pages" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "88ff5806-e3e2-46ce-82b8-6fa86eb9146f",
        "title": "Our Thinking",
        "permalink": "/our-thinking",
        "status": "published",
        "published_at": "2026-03-03T06:30:00.000Z",
        "seo": {"title": "Our Thinking"}
    }' > /dev/null 2>&1 || echo "  (page may already exist)"

# Restore "Our Services" page
echo "Restoring 'Our Services' page..."
curl -s -X POST "$API_URL/items/pages" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "e6b044ec-2f7f-436b-a0b6-06c2cbb260d1",
        "title": "Our Services",
        "permalink": "/our-services",
        "status": "published",
        "published_at": "2026-03-03T06:30:00.000Z",
        "seo": {"title": "Our Services"},
        "nav_text_hover_color": "#FFFFFF"
    }' > /dev/null 2>&1 || echo "  (page may already exist)"

# Restore block_hero for "Our Thinking"
echo "Restoring block_hero for 'Our Thinking'..."
curl -s -X POST "$API_URL/items/block_hero" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "41fb805c-ec17-49de-9d0b-c036655d7a42",
        "button_group": "a691d04f-170e-422d-b51b-e21ce1fc577b",
        "description": "We are a couple of curious minds. We learn. We share. Our insights come from real experience. Knowledge should be open to all and we'\''re on are on a mission to make technology smarter every day.",
        "enable_carousel": false,
        "autoplay_interval": 4000,
        "tagline_type": "text"
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Restore headline_line for "Our Thinking" hero
echo "Restoring headline_line..."
curl -s -X POST "$API_URL/items/block_hero_headline_line" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "5a2503a7-9b9f-473e-8a99-16c50409d601",
        "sort": 1,
        "block_hero": "41fb805c-ec17-49de-9d0b-c036655d7a42",
        "text": "<p>Insights that drive impact.</p>",
        "font_weight": "600",
        "font_style": "normal",
        "font_size": "xl"
    }' > /dev/null 2>&1 || echo "  (headline may already exist)"

# Restore block_featured_post
echo "Restoring block_featured_post..."
curl -s -X POST "$API_URL/items/block_featured_post" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "342c0ba4-3f94-4373-a923-4b9bf605155c",
        "tagline": "Recommended Today",
        "background_color": "#0B2D34",
        "post": "c96b64b4-9567-46f6-8eb5-ac2f37c4918d",
        "image": "1e83ad85-bada-4462-82ea-d03ee632baf9"
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Restore block_posts_carousel
echo "Restoring block_posts_carousel..."
curl -s -X POST "$API_URL/items/block_posts_carousel" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "81f2b7f7-4f6f-4012-9f9d-61927e283f51",
        "headline": "Artificial Intelligence",
        "description": "Raw takes on what we like to call choosing the \"right AI\". Explore perspectives from our AI experts - from the ethics of automation to AI strategies that work in 2026.",
        "limit": 4
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Restore block_all_posts
echo "Restoring block_all_posts..."
curl -s -X POST "$API_URL/items/block_all_posts" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "576cfdc6-6a91-425d-9994-03c72f84980a",
        "headline": "All Insights"
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Restore block_hero for "Our Services"
echo "Restoring block_hero for 'Our Services'..."
curl -s -X POST "$API_URL/items/block_hero" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "28d52159-5259-4db4-88c8-9b09604ecb76",
        "image": "a7bca898-4365-4b24-b10e-ca236243bc63",
        "description": "We don'\''t rely on '\''best practices'\'' to hide from the hard problems. We reframe your challenges, build in the necessary strategy and governance, and then drive the execution. We own the delivery culture so you can keep your focus on the business.",
        "layout": "image_expanded",
        "enable_carousel": false,
        "autoplay_interval": 4000,
        "tagline_type": "text",
        "tagline_image": "7c556aea-c1f9-49c2-9985-31e400a7dfa7"
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Restore headline_line for "Our Services" hero
echo "Restoring headline_line for 'Our Services'..."
curl -s -X POST "$API_URL/items/block_hero_headline_line" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "bef03e5e-d124-49d6-ab5c-77ee327e1f91",
        "sort": 1,
        "block_hero": "28d52159-5259-4db4-88c8-9b09604ecb76",
        "text": "<p>Our <em>Services</em></p>",
        "font_weight": "500",
        "font_style": "normal",
        "font_size": "md"
    }' > /dev/null 2>&1 || echo "  (headline may already exist)"

# Restore block_services_tab
echo "Restoring block_services_tab..."
curl -s -X POST "$API_URL/items/block_services_tab" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "de9c98db-b8c7-4d53-b9e2-f3e545122da7",
        "status": "published"
    }' > /dev/null 2>&1 || echo "  (block may already exist)"

# Link blocks to "Our Thinking" page
echo "Linking blocks to 'Our Thinking' page..."
curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "85163497-9651-466c-8b97-0e3278f6bef1",
        "sort": 1,
        "pages_id": "88ff5806-e3e2-46ce-82b8-6fa86eb9146f",
        "item": "41fb805c-ec17-49de-9d0b-c036655d7a42",
        "collection": "block_hero"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "81639c91-f485-4eb8-9c73-b464126ab76e",
        "sort": 2,
        "pages_id": "88ff5806-e3e2-46ce-82b8-6fa86eb9146f",
        "item": "342c0ba4-3f94-4373-a923-4b9bf605155c",
        "collection": "block_featured_post"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "f6a28cd3-0e85-46f4-b065-f87db36118bf",
        "sort": 3,
        "pages_id": "88ff5806-e3e2-46ce-82b8-6fa86eb9146f",
        "item": "81f2b7f7-4f6f-4012-9f9d-61927e283f51",
        "collection": "block_posts_carousel"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "85667dcf-7ab2-495f-a10d-8f50e2dc2d36",
        "sort": 4,
        "pages_id": "88ff5806-e3e2-46ce-82b8-6fa86eb9146f",
        "item": "576cfdc6-6a91-425d-9994-03c72f84980a",
        "collection": "block_all_posts"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

# Link blocks to "Our Services" page
echo "Linking blocks to 'Our Services' page..."
curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "c60f8354-8614-4383-bacb-9653b80d6739",
        "sort": 1,
        "pages_id": "e6b044ec-2f7f-436b-a0b6-06c2cbb260d1",
        "item": "28d52159-5259-4db4-88c8-9b09604ecb76",
        "collection": "block_hero"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

curl -s -X POST "$API_URL/items/pages_blocks" \
    -H "Content-Type: application/json" \
    -d '{
        "id": "085997e5-6097-466a-90bb-244903736727",
        "sort": 2,
        "pages_id": "e6b044ec-2f7f-436b-a0b6-06c2cbb260d1",
        "item": "de9c98db-b8c7-4d53-b9e2-f3e545122da7",
        "collection": "block_services_tab"
    }' > /dev/null 2>&1 || echo "  (link may already exist)"

echo "✓ Basic restoration complete"

ENDSSH

echo ""
echo "=========================================="
echo "Restoration Complete!"
echo "=========================================="
echo ""
echo "NOTE: The block_services_tab has complex nested data"
echo "(6 service items with panels, expertise cards, etc.)"
echo "that needs to be restored via SQL for data integrity."
echo ""
