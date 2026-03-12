#!/bin/bash
EC2_HOST="54.160.149.229"
EC2_USER="ec2-user"
SSH_KEY="c:/Users/HP/Downloads/directus-keys.pem"
RDS_HOST="insighture-directus.c9qm826agcm8.us-east-1.rds.amazonaws.com"
RDS_USER="postgres"
RDS_PASS="b0mtKDcNY59ys3kwbz5h"
RDS_DB="postgres"

PAGE_IDS="('88ff5806-e3e2-46ce-82b8-6fa86eb9146f','e6b044ec-2f7f-436b-a0b6-06c2cbb260d1')"

echo "Exporting Our Services and Our Thinking pages..."

ssh -i "$SSH_KEY" ${EC2_USER}@${EC2_HOST} << EOF
PGPASSWORD="$RDS_PASS" psql -h $RDS_HOST -U $RDS_USER -d $RDS_DB << 'SQLEND'

-- Create export file
\o /tmp/ec2-pages-export.sql

-- Export pages
\echo '-- Pages data'
SELECT 'INSERT INTO pages (id, status, user_created, date_created, user_updated, date_updated, title, permalink, seo, nav_overlay_mode, nav_background_color, nav_text_color, nav_text_hover_color, nav_scrolled_background_color, nav_scrolled_text_color, nav_scrolled_text_hover_color, nav_dropdown_background_color, nav_dropdown_text_color, nav_dropdown_text_hover_color, footer_cta_text, footer_cta_button_text, footer_cta_button_url, footer_cta_button_page) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(status) || ', ' ||
  COALESCE(quote_literal(user_created::text) || '::uuid', 'NULL') || ', ' ||
  COALESCE(quote_literal(date_created::text) || '::timestamp', 'NULL') || ', ' ||
  COALESCE(quote_literal(user_updated::text) || '::uuid', 'NULL') || ', ' ||
  COALESCE(quote_literal(date_updated::text) || '::timestamp', 'NULL') || ', ' ||
  quote_literal(title) || ', ' ||
  quote_literal(permalink) || ', ' ||
  COALESCE(quote_literal(seo::text), 'NULL') || '::json, ' ||
  COALESCE(nav_overlay_mode::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_background_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_text_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_text_hover_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_scrolled_background_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_scrolled_text_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_scrolled_text_hover_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_dropdown_background_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_dropdown_text_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(nav_dropdown_text_hover_color), 'NULL') || ', ' ||
  COALESCE(quote_literal(footer_cta_text), 'NULL') || ', ' ||
  COALESCE(quote_literal(footer_cta_button_text), 'NULL') || ', ' ||
  COALESCE(quote_literal(footer_cta_button_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(footer_cta_button_page::text) || '::uuid', 'NULL') ||
  ') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, permalink = EXCLUDED.permalink;'
FROM pages WHERE id IN $PAGE_IDS;

-- Export page blocks
\echo '-- Page blocks'
SELECT 'INSERT INTO pages_blocks (id, pages_id, item, collection, sort, hide_block, background) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(pages_id::text) || '::uuid, ' ||
  quote_literal(item::text) || '::uuid, ' ||
  quote_literal(collection) || ', ' ||
  COALESCE(sort::text, 'NULL') || ', ' ||
  COALESCE(hide_block::text, 'false') || ', ' ||
  COALESCE(quote_literal(background), 'NULL') ||
  ') ON CONFLICT (id) DO UPDATE SET sort = EXCLUDED.sort;'
FROM pages_blocks WHERE pages_id IN $PAGE_IDS ORDER BY sort;

\o
\q
SQLEND

# Output the file
cat /tmp/ec2-pages-export.sql
EOF
