/**
 * Adds fontfamily toolbar button + custom font list to all rich text fields in Directus.
 *
 * Usage:
 *   node add-fontfamily.js
 *
 * Requires: Local Directus running on http://localhost:8055
 * Uses admin credentials from docker-compose.yaml
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'dlr3ctu5';

const FONT_FAMILY_FORMATS = 'Albert Sans=Albert Sans, sans-serif;Open Sans=Open Sans, sans-serif';

// Fields to update: [collection, field]
const FIELDS_TO_UPDATE = [
	// Hero
	['block_hero_headline_line', 'text'],
	// Services
	['block_services', 'headline'],
	// RichText
	['block_richtext', 'content'],
	// Culture gallery
	['block_culture_gallery', 'title'],
	// Values
	['block_values', 'heading'],
	// People say
	['block_people_say', 'heading'],
	// Intro media
	['block_intro_media', 'heading'],
	// Open roles
	['block_open_roles', 'heading'],
	// CTA split
	['block_cta_split', 'heading'],
	// Posts
	['posts', 'content'],
];

async function main() {
	// 1. Authenticate
	console.log('Authenticating...');
	const authRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
	});

	if (!authRes.ok) {
		console.error('Auth failed:', await authRes.text());
		process.exit(1);
	}

	const { data: authData } = await authRes.json();
	const token = authData.access_token;
	console.log('Authenticated.\n');

	// 2. Also discover ALL input-rich-text-html fields dynamically
	console.log('Discovering all rich text fields...');
	const fieldsRes = await fetch(`${DIRECTUS_URL}/fields`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	const { data: allFields } = await fieldsRes.json();

	const richTextFields = allFields
		.filter((f) => f.meta?.interface === 'input-rich-text-html')
		.map((f) => [f.collection, f.field]);

	// Merge with our explicit list (dedup)
	const fieldSet = new Set(FIELDS_TO_UPDATE.map(([c, f]) => `${c}.${f}`));
	for (const [c, f] of richTextFields) {
		if (!fieldSet.has(`${c}.${f}`)) {
			FIELDS_TO_UPDATE.push([c, f]);
			fieldSet.add(`${c}.${f}`);
		}
	}

	console.log(`Found ${FIELDS_TO_UPDATE.length} rich text fields to update.\n`);

	// 3. Update each field
	let success = 0;
	let skipped = 0;
	let failed = 0;

	for (const [collection, field] of FIELDS_TO_UPDATE) {
		// Skip form builder email fields
		if (collection === 'form_builder' || field === 'message') {
			console.log(`  SKIP ${collection}.${field} (form/email field)`);
			skipped++;
			continue;
		}

		// Get current field config
		const getRes = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!getRes.ok) {
			console.log(`  FAIL ${collection}.${field} — could not read (${getRes.status})`);
			failed++;
			continue;
		}

		const { data: fieldData } = await getRes.json();
		const currentOptions = fieldData.meta?.options || {};

		// Build new options — preserve existing, add fontfamily
		const currentToolbar = currentOptions.toolbar || [];
		const newToolbar = currentToolbar.includes('fontfamily')
			? currentToolbar
			: ['fontfamily', ...currentToolbar];

		// Add font-family to valid_styles if present
		let newValidStyles = currentOptions.valid_styles;
		if (newValidStyles && newValidStyles['*'] && !newValidStyles['*'].includes('font-family')) {
			newValidStyles = { ...newValidStyles, '*': newValidStyles['*'] + ',font-family' };
		}

		const newOptions = {
			...currentOptions,
			toolbar: newToolbar,
			font_family_formats: FONT_FAMILY_FORMATS,
		};

		if (newValidStyles) {
			newOptions.valid_styles = newValidStyles;
		}

		// Patch
		const patchRes = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ meta: { options: newOptions } }),
		});

		if (patchRes.ok) {
			console.log(`  OK   ${collection}.${field}`);
			success++;
		} else {
			const errText = await patchRes.text();
			console.log(`  FAIL ${collection}.${field} — ${patchRes.status}: ${errText}`);
			failed++;
		}
	}

	console.log(`\nDone! ${success} updated, ${skipped} skipped, ${failed} failed.`);
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});
