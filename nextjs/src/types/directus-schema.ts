export interface ExtensionSeoMetadata {
	title?: string;
	meta_description?: string;
	og_image?: string;
	additional_fields?: Record<string, unknown>;
	sitemap?: {
		change_frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
		priority: string;
	};
	no_index?: boolean;
	no_follow?: boolean;
}

export interface BlockPlatformCta {
	/** @primaryKey */
	id: string;
	/** @description Rich text / WYSIWYG headline. Use <em> for italic accent text. */
	title?: string | null;
	/** @description Supporting paragraph below the headline. */
	description?: string | null;
	/** @description Label text for the CTA button. */
	cta_label?: string | null;
	/** @description URL for the CTA button (relative or absolute). */
	cta_url?: string | null;
	/** @description Right-side feature image (Directus file UUID). */
	image?: DirectusFile | string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface AiPrompt {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Unique name for the prompt. Use names like "create-article" or "generate-product-description". @required */
	name: string;
	/** @description Is this prompt published and available to use? */
	status?: 'draft' | 'in_review' | 'published';
	/** @description Briefly explain what this prompt does in 1-2 sentences. */
	description?: string | null;
	/** @description Optional: Define the conversation structure between users and AI. Used to add context and improve outputs. */
	messages?: Array<{ role: 'user' | 'assistant'; text: string }> | null;
	/** @description Instructions that shape how the AI responds. */
	system_prompt?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockButton {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description What type of link is this? Page and Post allow you to link to internal content. URL is for external content. Group can contain other menu items. */
	type?: 'page' | 'post' | 'url' | null;
	/** @description The internal page to link to. */
	page?: Page | string | null;
	/** @description The internal post to link to. */
	post?: Post | string | null;
	/** @description Text to include on the button. */
	label?: string | null;
	/** @description What type of button */
	variant?: 'default' | 'outline' | 'soft' | 'ghost' | 'link' | null;
	/** @description The id of the Button Group this button belongs to. */
	button_group?: BlockButtonGroup | string | null;
	/** @description The URL to link to. Could be relative (ie `/my-page`) or a full external URL (ie `https://docs.directus.io`) */
	url?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockButtonGroup {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Add individual buttons to the button group. */
	buttons?: BlockButton[] | string[];
}

export interface BlockForm {
	/** @primaryKey */
	id: string;
	/** @description Form to show within block */
	form?: Form | string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockGallery {
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Images to include in the image gallery. */
	items?: DirectusFile[] | string[] | null;
}

export interface BlockGalleryItem {
	/** @primaryKey */
	id: string;
	/** @description The id of the gallery block this item belongs to. */
	block_gallery?: BlockGallery | string | null;
	/** @description The id of the file included in the gallery. */
	directus_file?: DirectusFile | string | null;
	sort?: number | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockHeroSlide {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The hero block this slide belongs to. */
	block_hero?: BlockHero | string | null;
	/** @description Full-bleed background image for this slide (also used as video poster). */
	background_image?: DirectusFile | string | null;
	/** @description Background video for this slide (replaces background_image when present). */
	background_video?: DirectusFile | string | null;
	/** @description CSS background value (color or gradient) used when no background image. */
	background_color?: string | null;
	/** @description Small logo or badge image displayed above the headline. */
	tagline_image?: DirectusFile | string | null;
	/** @description Portrait or subject image displayed on the right side (also used as video poster). */
	subject_image?: DirectusFile | string | null;
	/** @description Subject video for this slide (replaces subject_image when present). */
	subject_video?: DirectusFile | string | null;
	/** @description Main headline for this slide. */
	headline?: string | null;
	/** @description Styled italic suffix shown after the main headline (e.g. 'better'). */
	headline_emphasis?: string | null;
	/** @description Supporting copy below the headline for this slide. */
	description?: string | null;
	/** @description Where to position the text block within this slide. */
	text_placement?: 'center_left' | 'bottom_center' | 'bottom_left' | 'center_center' | null;
	/** @description Enable a dark gradient overlay on this slide for improved text legibility. */
	enable_gradient_overlay?: boolean | null;
	/** @description Overlay image (e.g. gradient texture, pattern) rendered on top of the background. */
	overlay_image?: DirectusFile | string | null;
	/** @description Opacity of the overlay image (0 = invisible, 1 = fully opaque). */
	overlay_opacity?: number | null;
	/** @description Hover background color for button 1. */
	button_1_hover_bg_color?: string | null;
	/** @description Hover text color for button 1. */
	button_1_hover_text_color?: string | null;
	/** @description Hover background color for button 2. */
	button_2_hover_bg_color?: string | null;
	/** @description Hover text color for button 2. */
	button_2_hover_text_color?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockHeroHeadlineLine {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The hero block this line belongs to. */
	block_hero?: BlockHero | string | null;
	/** @description Text content for this headline line. */
	text?: string | null;
	/** @description Font weight: 400, 500, 600, 700, or 800. */
	font_weight?: string | null;
	/** @description Font style: normal or italic. */
	font_style?: string | null;
	/** @description Named size: sm, md, lg, xl, 2xl, or 3xl. */
	font_size?: string | null;
	/** @description Optional color override for this headline line (CSS color value). */
	color?: string | null;
}

export interface BlockHero {
	/** @primaryKey */
	id: string;
	/** @description Featured image in the hero (also used as video poster). */
	image?: DirectusFile | string | null;
	/** @description Video file for the hero (replaces image when present; image becomes poster). */
	video?: DirectusFile | string | null;
	/** @description Action buttons that show below headline and description. */
	button_group?: BlockButtonGroup | string | null;
	/** @description Supporting copy that shows below the headline. */
	description?: string | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	/** @description Whether the tagline is plain text or an image/SVG wordmark. */
	tagline_type?: 'text' | 'image' | null;
	/** @description Image/SVG used as the tagline wordmark. */
	tagline_image?: DirectusFile | string | null;
	/** @description Accessible alt text for the tagline image. */
	tagline_image_alt?: string | null;
	/** @description The layout for the component. */
	layout?: 'image_left' | 'image_center' | 'image_right' | 'image_expanded' | null;
	/** @description Enable auto-looping carousel when layout is image_expanded. */
	enable_carousel?: boolean | null;
	/** @description Milliseconds between slide transitions. */
	autoplay_interval?: number | null;
	/** @description Styled headline lines, each with independent weight/style/size config. */
	headline_lines?: BlockHeroHeadlineLine[] | string[];
	/** @description Slides for the carousel. */
	slides?: BlockHeroSlide[] | string[];
	/** @description Enable a dark gradient overlay on the expanded image for improved text legibility. */
	enable_gradient_overlay?: boolean | null;
	/** @description Overlay image (e.g. gradient texture, pattern) rendered on top of the background. */
	overlay_image?: DirectusFile | string | null;
	/** @description Opacity of the overlay image (0 = invisible, 1 = fully opaque). */
	overlay_opacity?: number | null;
	/** @description Where to position the text block within the image_expanded layout. */
	expanded_text_placement?: 'center_left' | 'bottom_center' | 'bottom_left' | 'center_center' | null;
	/** @description Horizontal alignment of text within the content block. */
	expanded_text_alignment?: 'left' | 'center' | 'right' | null;
	/** @description Height of the hero section in vh units (e.g. 75 for 75vh). Leave empty for full screen. */
	height?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockPost {
	/** @primaryKey */
	id: string;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description The collection of content to fetch and display on the page within this block. @required */
	collection: 'posts';
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	limit?: number | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockPricing {
	/** @primaryKey */
	id: string;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description The individual pricing cards to display. */
	pricing_cards?: BlockPricingCard[] | string[];
}

export interface BlockPricingCard {
	/** @primaryKey */
	id: string;
	/** @description Name of the pricing plan. Shown at the top of the card. */
	title?: string | null;
	/** @description Short, one sentence description of the pricing plan and who it is for. */
	description?: string | null;
	/** @description Price and term for the pricing plan. (ie `$199/mo`) */
	price?: string | null;
	/** @description Badge that displays at the top of the pricing plan card to add helpful context. */
	badge?: string | null;
	/** @description Short list of features included in this plan. Press `Enter` to add another item to the list. */
	features?: 'json' | null;
	/** @description The action button / link shown at the bottom of the pricing card. */
	button?: BlockButton | string | null;
	/** @description The id of the pricing block this card belongs to. */
	pricing?: BlockPricing | string | null;
	/** @description Add highlighted border around the pricing plan to make it stand out. */
	is_highlighted?: boolean | null;
	sort?: number | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockRichtext {
	/** @primaryKey */
	id: string;
	/** @description Layout variant: 'default' (centered, no button) or 'hero' (with button, bottom-aligned). */
	variant?: 'default' | 'hero' | null;
	/** @description Rich text content for this block. */
	content?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description Controls how the content block is positioned on the page. */
	alignment?: 'left' | 'center' | 'right' | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	/** @description Background color of the block (CSS color value). */
	background_color?: string | null;
	/** @description Full-width background image behind the section content. */
	background_image?: string | null;
	/** @description Main text color override. */
	text_color?: string | null;
	/** @description Color applied to italic/emphasized text (<em> tags). */
	emphasis_color?: string | null;
	/** @description Show decorative quotation mark in corners. */
	show_quotes?: boolean | null;
	button_text?: string | null;
	button_url?: string | null;
	button_page?: { permalink: string | null } | string | null;
	button_variant?: string | null;
	button_bg_color?: string | null;
	button_text_color?: string | null;
	button_border_color?: string | null;
	headline_font_size?: string | null;
	headline_font_weight?: string | null;
	headline_font_style?: string | null;
	headline_color?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServicesItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The services block this item belongs to. */
	block_services?: BlockServices | string | null;
	/** @description Service name / card title. */
	title?: string | null;
	/** @description Short description of this service. */
	description?: string | null;
	/** @description Accent color for the left border and pill button (CSS color value). */
	accent_color?: string | null;
	/** @description Label for the "Learn more" link. */
	link_label?: string | null;
	/** @description URL the "Learn more" link navigates to. */
	url?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServices {
	/** @primaryKey */
	id: string;
	/** @description Smaller copy shown above the headline to label a section. */
	tagline?: string | null;
	/** @description Main headline (supports inline HTML for per-word color). */
	headline?: string | null;
	/** @description Subtitle text shown below the headline. */
	description?: string | null;
	/** @description Background color of the section (CSS color value, default #f9fafb). */
	background_color?: string | null;
	/** @description Service cards shown in the grid. */
	items?: BlockServicesItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockLogoCarouselItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	/** @description The parent logo carousel this item belongs to. */
	block_logo_carousel?: BlockLogoCarousel | string | null;
	/** @description Company or partner name. */
	name?: string | null;
	/** @description Optional link when clicking the logo. */
	url?: string | null;
	/** @description The logo image. */
	logo?: DirectusFile | string | null;
	/** @description Year or subtitle (e.g., '2024', '2025'). */
	subtitle?: string | null;
}

export interface BlockLogoCarousel {
	/** @primaryKey */
	id: string;
	status?: 'published' | 'draft' | 'archived' | null;
	/** @description Centered text displayed above the scrolling logos. */
	tagline?: string | null;
	/** @description Text color for the tagline (CSS color value, defaults to white). */
	tagline_color?: string | null;
	/** @description Background color of the section (CSS color value, default #0b2d34). */
	background_color?: string | null;
	/** @description Logo items in the carousel. */
	logos?: BlockLogoCarouselItem[] | string[];
	/** @description Display mode: 'auto' for continuous marquee, 'manual' for card-based pagination with arrows. */
	variant?: 'auto' | 'manual' | null;
	/** @description Number of cards visible at once in manual variant (1-6, default 3). */
	cards_per_view?: number | null;
	/** @description Show arrow navigation buttons in manual variant (default true). */
	show_navigation?: boolean | null;
}

export interface BlockCardGridItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The parent card grid this item belongs to. */
	block_card_grid?: BlockCardGrid | string | null;
	/** @description Card display variant: feature (bordered, icon-based) or testimonial (logo-based, quote). */
	variant?: 'feature' | 'testimonial' | null;
	/** @description Image for the card (icon for feature variant, logo for testimonial variant). */
	image?: DirectusFile | string | null;
	/** @description Card title (used for feature variant). */
	title?: string | null;
	/** @description Card description (used for feature variant). */
	description?: string | null;
	/** @description Testimonial quote (used for testimonial variant). */
	quote?: string | null;
	/** @description Author name (used for testimonial variant). */
	author_name?: string | null;
	/** @description Author role/position (used for testimonial variant). */
	author_role?: string | null;
	/** @description Optional accent color for the card (CSS color value). */
	accent_color?: string | null;
}

export interface BlockReachOutContactItem {
	/** @primaryKey */
	id: number;
	sort?: number | null;
	/** @description The reach out block this item belongs to. */
	block_reach_out?: BlockReachOut | number | null;
	/** @description Contact method label (e.g. "Email us", "Global enquiries"). */
	label?: string | null;
	/** @description Contact value (e.g. email address or phone number). */
	value?: string | null;
	/** @description Supporting description line below the value. */
	description?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockCultureGallery {
	/** @primaryKey */
	id: string;
	/** @description Section title as HTML (WYSIWYG). */
	title?: string | null;
	/** @description Subtitle paragraph below the heading. */
	description?: string | null;
	/** @description Smaller Polaroid photo at the top-left corner. */
	side_photo_left?: DirectusFile | string | null;
	/** @description Smaller Polaroid photo at the top-right corner. */
	side_photo_right?: DirectusFile | string | null;
	/** @description First bottom Polaroid photo. */
	photo_1?: DirectusFile | string | null;
	/** @description Caption for first bottom Polaroid. */
	caption_1?: string | null;
	/** @description Second bottom Polaroid photo. */
	photo_2?: DirectusFile | string | null;
	/** @description Caption for second bottom Polaroid. */
	caption_2?: string | null;
	/** @description Third bottom Polaroid photo. */
	photo_3?: DirectusFile | string | null;
	/** @description Caption for third bottom Polaroid. */
	caption_3?: string | null;
	/** @description Fourth bottom Polaroid photo. */
	photo_4?: DirectusFile | string | null;
	/** @description Caption for fourth bottom Polaroid. */
	caption_4?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockCtaSplit {
	/** @primaryKey */
	id: number;
	/** @description Left-side heading as HTML (supports italic pink accent). */
	heading?: string | null;
	/** @description Right-side description paragraph. */
	description?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockOpenRolesJob {
	/** @primaryKey */
	id: number;
	sort?: number | null;
	block_open_roles?: BlockOpenRoles | number | null;
	/** @description Tab this job appears under. */
	type?: 'open_roles' | 'internship' | null;
	/** @description Job title. */
	title?: string | null;
	/** @description Department/category used for grouping. */
	department?: string | null;
	/** @description Location label, e.g. "Colombo | Sri Lanka". */
	location?: string | null;
	/** @description Country flag image (optional). */
	location_flag?: string | null;
	/** @description URL slug for the job detail page, e.g. "ms-dynamics-consultant-with-aws". */
	slug?: string | null;
	/** @description Job overview / intro paragraph (WYSIWYG HTML). */
	overview?: string | null;
	/** @description Key responsibilities (WYSIWYG HTML). */
	responsibilities?: string | null;
	/** @description Requirements / qualifications (WYSIWYG HTML). */
	requirements?: string | null;
	/** @description Application form linked to this job. */
	form?: Form | string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockOpenRoles {
	/** @primaryKey */
	id: number;
	/** @description Section heading as HTML (supports italic pink accent). */
	heading?: string | null;
	/** @description Subtitle paragraph shown below the heading. */
	description?: string | null;
	/** @description List of job positions shown in the listing. */
	jobs?: BlockOpenRolesJob[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockIntroMedia {
	/** @primaryKey */
	id: number;
	/** @description Section heading as HTML (supports italic pink accent). */
	heading?: string | null;
	/** @description Paragraph text shown below the heading. */
	description?: string | null;
	/** @description Right-side image. */
	image?: string | null;
	/** @description Optional YouTube/Vimeo URL to embed instead of the image. */
	video_url?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockPeopleSaySlide {
	/** @primaryKey */
	id: number;
	sort?: number | null;
	block_people_say?: BlockPeopleSay | number | null;
	/** @description Photo of the person. */
	image?: string | null;
	/** @description The quote text. */
	quote?: string | null;
	/** @description Person's name. */
	name?: string | null;
	/** @description Person's job title/role. */
	role?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockCardGrid {
	/** @primaryKey */
	id: string;
	status?: 'published' | 'draft' | 'archived' | null;
	/** @description Smaller copy shown above the headline to label a section or add extra context. */
	tagline?: string | null;
	/** @description Larger main headline for this page section. */
	headline?: string | null;
	/** @description Description text shown below the headline. */
	description?: string | null;
	/** @description Number of columns on desktop (1-4). Automatically responsive on smaller screens. */
	columns?: number | null;
	/** @description Background color of the section (CSS color value). */
	background_color?: string | null;
	/** @description Card items displayed in the grid. Can mix feature and testimonial variants. */
	items?: BlockCardGridItem[] | string[];
}

export interface BlockPeopleSay {
	/** @primaryKey */
	id: number;
	/** @description Section heading as HTML (supports italic pink accent). */
	heading?: string | null;
	/** @description Testimonial slides shown in the carousel. */
	slides?: BlockPeopleSaySlide[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockValuesItem {
	/** @primaryKey */
	id: number;
	sort?: number | null;
	/** @description The values block this item belongs to. */
	block_values?: BlockValues | number | null;
	/** @description Icon image for the value card. */
	icon?: string | null;
	/** @description Value card title. */
	title?: string | null;
	/** @description Value card description text. */
	description?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockValues {
	/** @primaryKey */
	id: number;
	/** @description Section heading as HTML (supports pink italic accent text). */
	heading?: string | null;
	/** @description Center tall photo shown between the value cards. */
	center_image?: string | null;
	/** @description List of value cards (up to 4, first 2 on left, last 2 on right). */
	value_items?: BlockValuesItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockAcknowledgement {
	/** @primaryKey */
	id: string;
	/** @description The acknowledgement text displayed in the banner. */
	text?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockReachOut {
	/** @primaryKey */
	id: number;
	/** @description Form to display on the left side of the Reach Out block. */
	form?: Form | string | null;
	/** @description Section heading (e.g. "Reach out"). */
	heading?: string | null;
	/** @description Title shown on the brochure card. */
	brochure_title?: string | null;
	/** @description Thumbnail image for the brochure card. */
	brochure_image?: DirectusFile | string | null;
	/** @description PDF file for the downloadable brochure. */
	brochure_pdf?: DirectusFile | string | null;
	/** @description Label for the brochure download link. */
	brochure_download_label?: string | null;
	/** @description Heading for the contact information section. */
	inquiries_heading?: string | null;
	/** @description List of contact entries shown in the inquiries section. */
	contact_items?: BlockReachOutContactItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface FormField {
	/** @primaryKey */
	id: string;
	/** @description Unique field identifier, not shown to users (lowercase, hyphenated) */
	name?: string | null;
	/** @description Input type for the field */
	type?: 'text' | 'textarea' | 'checkbox' | 'checkbox_group' | 'radio' | 'file' | 'select' | 'hidden' | null;
	/** @description Text label shown to form users. */
	label?: string | null;
	/** @description Default text shown in empty input. */
	placeholder?: string | null;
	/** @description Additional instructions shown below the input */
	help?: string | null;
	/** @description Available rules: `email`, `url`, `min:5`, `max:20`, `length:10`. Combine with pipes example: `email|max:255` */
	validation?: string | null;
	/** @description Field width on the form */
	width?: '100' | '67' | '50' | '33' | null;
	/** @description Options for radio or select inputs */
	choices?: Array<{ text: string; value: string }> | null;
	/** @description Parent form this field belongs to. */
	form?: Form | string | null;
	sort?: number | null;
	/** @description Make this field mandatory to complete. */
	required?: boolean | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Form {
	/** @primaryKey */
	id: string;
	/** @description Action after successful submission. */
	on_success?: 'redirect' | 'message' | null;
	sort?: number | null;
	/** @description Text shown on submit button. */
	submit_label?: string | null;
	/** @description Message shown after successful submission. */
	success_message?: string | null;
	/** @description Message shown when form submission fails. */
	error_message?: string | null;
	/** @description Form name (for internal reference). */
	title?: string | null;
	/** @description Destination URL after successful submission. */
	success_redirect_url?: string | null;
	/** @description Show or hide this form from the site. */
	is_active?: boolean | null;
	/** @description Show or hide the form title on the frontend. */
	show_title?: boolean | null;
	/** @description Optional paragraph shown below the title and above the form fields. */
	intro_paragraph?: string | null;
	/** @description Full text for the privacy policy checkbox. Leave empty to hide. */
	privacy_policy_text?: string | null;
	/** @description The word or phrase in the checkbox text to turn into a link. */
	privacy_policy_link_text?: string | null;
	/** @description URL for the privacy policy link. */
	privacy_policy_link_url?: string | null;
	/** @description Controls the width of the submit button: 33, 50, 67, or 100 percent. */
	submit_button_width?: '33' | '50' | '67' | '100' | null;
	/** @description Setup email notifications when forms are submitted. */
	emails?: Array<{ to: string[]; subject: string; message: string }> | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Form structure and input fields */
	fields?: FormField[] | string[];
	/** @description Received form responses. */
	submissions?: FormSubmission[] | string[];
}

export interface FormSubmission {
	/** @description Unique ID for this specific form submission @primaryKey */
	id: string;
	/** @description Form submission date and time. */
	timestamp?: string | null;
	/** @description Associated form for this submission. */
	form?: Form | string | null;
	/** @description Submitted field responses */
	values?: FormSubmissionValue[] | string[];
}

export interface FormSubmissionValue {
	/** @primaryKey */
	id?: string;
	/** @description Parent form submission for this value. */
	form_submission?: FormSubmission | string | null;
	field?: FormField | string | null;
	/** @description The data entered by the user for this specific field in the form submission. */
	value?: string | null;
	sort?: number | null;
	file?: DirectusFile | string | null;
	/** @description Form submission date and time. */
	timestamp?: string | null;
}

export interface Globals {
	/** @description Site summary for search results. */
	description?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Social media profile URLs */
	social_links?: Array<{
		url: string;
		service: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'vimeo' | 'youtube' | 'github' | 'discord' | 'docker';
	}> | null;
	/** @description Short phrase describing the site. */
	tagline?: string | null;
	/** @description Main site title */
	title?: string | null;
	/** @description Public URL for the website */
	url?: string | null;
	/** @description Small icon for browser tabs. 1:1 ratio. No larger than 512px × 512px. */
	favicon?: DirectusFile | string | null;
	/** @description Main logo shown on the site (for light mode). */
	logo?: DirectusFile | string | null;
	/** @description Secret OpenAI API key. Don't share with anyone outside your team. */
	openai_api_key?: string | null;
	/** @description The public URL for this Directus instance. Used in Flows. */
	directus_url?: string | null;
	/** @description Main logo shown on the site (for dark mode). */
	logo_dark_mode?: DirectusFile | string | null;
	/** @description Accent color for the website (used on buttons, links, etc). */
	accent_color?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Navigation {
	/** @description Unique identifier for this menu. Can't be edited after creation. @primaryKey */
	id: string;
	/** @description What is the name of this menu? Only used internally. */
	title?: string | null;
	/** @description Show or hide this menu from the site. */
	is_active?: boolean | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Text color for the currently active navigation item. */
	active_text_color?: string | null;
	/** @description Underline color for the currently active navigation item. */
	active_underline_color?: string | null;
	/** @description Active text color when the page is scrolled. Falls back to active_text_color. */
	scrolled_active_text_color?: string | null;
	/** @description Active underline color when the page is scrolled. Falls back to active_underline_color. */
	scrolled_active_underline_color?: string | null;
	/** @description Links within the menu. */
	items?: NavigationItem[] | string[];
}

export interface NavigationItem {
	/** @primaryKey */
	id: string;
	/** @description Navigation menu that the individual links belong to. */
	navigation?: Navigation | string | null;
	/** @description The internal page to link to. */
	page?: Page | string | null;
	/** @description The parent navigation item. */
	parent?: NavigationItem | string | null;
	sort?: number | null;
	/** @description Label shown to the user for the menu item. @required */
	title: string;
	/** @description What type of link is this? Page and Post allow you to link to internal content. URL is for external content. Group can contain other menu items. */
	type?: 'page' | 'post' | 'url' | 'group' | null;
	/** @description The URL to link to. Could be relative (ie `/my-page`) or a full external URL (ie `https://docs.directus.io`) */
	url?: string | null;
	/** @description The internal post to link to. */
	post?: Post | string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Add child menu items within the group. */
	children?: NavigationItem[] | string[];
}

export interface PageBlock {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The id of the page that this block belongs to. */
	page?: Page | string | null;
	/** @description The data for the block. */
	item?: BlockHero | BlockRichtext | BlockForm | BlockPost | BlockGallery | BlockPricing | BlockReachOut | BlockAcknowledgement | BlockCultureGallery | BlockValues | BlockPeopleSay | BlockIntroMedia | BlockOpenRoles | BlockCtaSplit | string | null;
	/** @description The collection (type of block). */
	collection?: string | null;
	/** @description Temporarily hide this block on the website without having to remove it from your page. */
	hide_block?: boolean | null;
	/** @description Background color for the block to create contrast. Does not control dark or light mode for the entire site. */
	background?: 'light' | 'dark' | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Page {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The title of this page. @required */
	title: string;
	/** @description Unique URL for this page (start with `/`, can have multiple segments `/about/me`)). @required */
	permalink: string;
	/** @description Is this page published? */
	status?: 'draft' | 'in_review' | 'published';
	/** @description Publish now or schedule for later. */
	published_at?: string | null;
	seo?: ExtensionSeoMetadata | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
	/** @description Create and arrange different content blocks (like text, images, or videos) to build your page. */
	blocks?: PageBlock[] | string[];
	/** @description Override nav mode for this page: 'overlay' | 'sticky' | null (inherit). */
	nav_overlay_mode?: string | null;
	/** @description Override nav background color for this page. Null = inherit. */
	nav_background_color?: string | null;
	/** @description Override nav link text color for this page. Null = inherit. */
	nav_text_color?: string | null;
	/** @description Override nav link hover color for this page. Null = inherit. */
	nav_text_hover_color?: string | null;
	/** @description Override scrolled nav background color for this page. Null = inherit. */
	nav_scrolled_background_color?: string | null;
	/** @description Override scrolled nav text color for this page. Null = inherit. */
	nav_scrolled_text_color?: string | null;
	/** @description Override nav link hover color after scrolling for this page. Null = inherit. */
	nav_scrolled_text_hover_color?: string | null;
	/** @description Background color of the nav dropdown panel. Null = theme default. */
	nav_dropdown_background_color?: string | null;
	/** @description Text color of nav dropdown links. Null = theme default. */
	nav_dropdown_text_color?: string | null;
	/** @description Hover color of nav dropdown links. Null = theme default. */
	nav_dropdown_text_hover_color?: string | null;
	/** @description Override nav logo for this page (file UUID). Null = inherit. */
	nav_logo_override?: string | null;
	/** @description Override CTA button background color for this page. Null = inherit. */
	nav_cta_background_color?: string | null;
	/** @description Override CTA button text color for this page. Null = inherit. */
	nav_cta_text_color?: string | null;
	/** @description Override scrolled CTA button background color for this page. Null = inherit. */
	nav_scrolled_cta_background_color?: string | null;
	/** @description Override scrolled CTA button text color for this page. Null = inherit. */
	nav_scrolled_cta_text_color?: string | null;
	/** @description Override active nav item text color for this page. Null = inherit. */
	nav_active_text_color?: string | null;
	/** @description Override active nav item underline color for this page. Null = inherit. */
	nav_active_underline_color?: string | null;
	/** @description Override scrolled active text color for this page. Null = inherit. */
	nav_scrolled_active_text_color?: string | null;
	/** @description Override scrolled active underline color for this page. Null = inherit. */
	nav_scrolled_active_underline_color?: string | null;
	/** @description Footer CTA text content. */
	footer_cta_text?: string | null;
	/** @description Footer CTA button label. */
	footer_cta_button_text?: string | null;
	/** @description Footer CTA button URL. */
	footer_cta_button_url?: string | null;
	/** @description Footer CTA button page link. */
	footer_cta_button_page?: { permalink: string | null } | string | null;
}

export interface Post {
	/** @description Rich text content of your blog post. */
	content?: string | null;
	/** @primaryKey */
	id: string;
	/** @description Featured image for this post. Used in cards linking to the post and in the post detail page. */
	image?: DirectusFile | string | null;
	/** @description Unique URL for this post (e.g., `yoursite.com/posts/{{your-slug}}`) */
	slug?: string | null;
	sort?: number | null;
	/** @description Is this post published? */
	status?: 'draft' | 'in_review' | 'published';
	/** @description Title of the blog post (used in page title and meta tags) @required */
	title: string;
	/** @description Short summary of the blog post to entice readers. */
	description?: string | null;
	/** @description Select the team member who wrote this post */
	author?: DirectusUser | string | null;
	/** @description The type of post: insight, story, or update. */
	type?: 'insight' | 'story' | 'update' | null;
	/** @description Publish now or schedule for later. */
	published_at?: string | null;
	seo?: ExtensionSeoMetadata | null;
	service? : BlockServicesItem | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceFeaturedArticle {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Small uppercase label shown above the headline. */
	tagline?: string | null;
	/** @description Main headline text. */
	headline?: string | null;
	/** @description CTA button label. */
	cta_label?: string | null;
	/** @description CTA button URL. */
	cta_url?: string | null;
	/** @description Featured image (Directus file UUID). Bleeds to the left edge on desktop. */
	image?: DirectusFile | string | null;
	/** @description Alt text for the featured image. */
	image_alt?: string | null;
	/** @description Outer section background color. Defaults to #0fa2bf. Overridden by parent service item accent_color when embedded in a service tab. */
	background_color?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceCredentialsCTABadge {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Certification badge image. */
	image?: DirectusFile | string | null;
	/** @description Alt text for the badge image. */
	alt?: string | null;
	block_service_credentials_cta?: BlockServiceCredentialsCTA | string | null;
}

export interface BlockServiceCredentialsCTAStat {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Icon image for the stat card. */
	icon?: DirectusFile | string | null;
	/** @description Numeric value display, e.g. "50+" */
	value?: string | null;
	/** @description Label below the value, e.g. "Experienced cloud consultants" */
	label?: string | null;
	block_service_credentials_cta?: BlockServiceCredentialsCTA | string | null;
}

export interface BlockServiceProductCatalogueItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Product name shown in the list item. */
	label?: string | null;
	block_service_product_catalogue?: BlockServiceProductCatalogue | string | null;
}

export interface BlockServiceProductCatalogue {
	/** @primaryKey */
	id: string;
	/** @description Main headline text (without emphasis). */
	headline?: string | null;
	/** @description Italic accent-colored suffix, e.g. "designed to scale with your business." */
	headline_emphasis?: string | null;
	/** @description Large product screenshot shown on the right (bleeds to edge). */
	image?: DirectusFile | string | null;
	/** @description Alt text for the product screenshot. */
	image_alt?: string | null;
	/** @description Clickable product list items shown on the left. */
	products?: BlockServiceProductCatalogueItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceCredentialsCTA {
	/** @primaryKey */
	id: string;
	/** @description Main headline (plain text, without emphasis). */
	headline?: string | null;
	/** @description Italic accent-colored suffix appended to the headline. */
	headline_emphasis?: string | null;
	/** @description Row of overlapping certification badge images. */
	badges?: BlockServiceCredentialsCTABadge[] | string[];
	/** @description Stat cards shown in the right column. */
	stats?: BlockServiceCredentialsCTAStat[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockFeaturedPostRecommendedPost {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	block_featured_post_id?: BlockFeaturedPost | string | null;
	posts_id?: Post | string | null;
}

export interface BlockFeaturedPost {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Label shown above the headline (e.g. "Featured Article"). */
	tagline?: string | null;
	/** @description Background color of the section (CSS color value). Defaults to brand pink. */
	background_color?: string | null;
	/** @description Hero image displayed on the left panel. Independent of the post image. */
	image?: DirectusFile | string | null;
	/** @description The post linked to the left panel. If null, the latest published post is used. */
	special_post?: Post | string | null;
	/** @description Custom display title shown under the image. Falls back to the post title if not set. */
	special_post_title?: string | null;
	/** @description Manually selected posts for the Recommended Today panel (up to 4). Falls back to latest posts if empty. */
	recommended_posts?: BlockFeaturedPostRecommendedPost[] | string[] | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}
export interface BlockServiceTabsItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The service tabs block this item belongs to. */
	block_service_tabs?: BlockServiceTabs | string | null;
	/** @description Label shown on the tab button. */
	label?: string | null;
	/** @description CSS accent color for the active tab indicator. */
	accent_color?: string | null;
	/** @description Headline shown in the content panel when this tab is active. */
	headline?: string | null;
	/** @description Body copy shown below the headline. */
	description?: string | null;
	/** @description Featured image shown alongside the text content. */
	image?: DirectusFile | string | null;
	/** @description CTA link label. */
	link_label?: string | null;
	/** @description CTA link URL. */
	url?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceTabs {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Small uppercase label shown above the headline. */
	tagline?: string | null;
	/** @description Main section headline. */
	headline?: string | null;
	/** @description Individual service tab items. */
	items?: BlockServiceTabsItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceShowcaseItemCard {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The showcase item this card belongs to. */
	showcase_item?: BlockServiceShowcaseItem | string | null;
	/** @description Emoji or icon identifier for the card. */
	icon?: string | null;
	/** @description Card title. */
	title?: string | null;
	/** @description Card body copy. */
	description?: string | null;
	/** @description CTA link label. */
	link_label?: string | null;
	/** @description CTA link URL. */
	url?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceShowcaseItemStat {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The showcase item this stat belongs to. */
	showcase_item?: BlockServiceShowcaseItem | string | null;
	/** @description Emoji or icon identifier for the stat. */
	icon?: string | null;
	/** @description The statistic value (e.g. "500+"). */
	value?: string | null;
	/** @description Descriptive label below the stat value. */
	label?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceShowcaseItemProduct {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The showcase item this product belongs to. */
	showcase_item?: BlockServiceShowcaseItem | string | null;
	/** @description Product name / list item title. */
	title?: string | null;
	/** @description Highlight this item with an accent marker. */
	is_highlighted?: boolean | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceShowcaseItem {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description The showcase block this item belongs to. */
	block_service_showcase?: BlockServiceShowcase | string | null;
	/** @description Label shown on the service selector tab. */
	label?: string | null;
	/** @description CSS accent color for this service's visual identity. */
	accent_color?: string | null;
	/** @description Service display name. */
	service_name?: string | null;
	/** @description Short tagline shown above the service name. */
	service_tagline?: string | null;
	/** @description Full description of the service. */
	service_description?: string | null;
	/** @description JSON array of key service bullet points. */
	key_services?: string[] | null;
	/** @description Hero image for the service overview. */
	service_image?: DirectusFile | string | null;
	/** @description Heading for the expertise / capabilities section. */
	expertise_heading?: string | null;
	/** @description Italic emphasis suffix for the expertise heading. */
	expertise_heading_emphasis?: string | null;
	/** @description Determines which CTA layout to render: 'credentials' or 'product'. */
	cta_type?: 'credentials' | 'product' | null;
	/** @description Headline for the credentials CTA block. */
	cta_headline?: string | null;
	/** @description Italic emphasis suffix for the credentials CTA headline. */
	cta_headline_emphasis?: string | null;
	/** @description Credentials/awards image for the credentials CTA. */
	cta_credentials_image?: DirectusFile | string | null;
	/** @description Headline for the product CTA block. */
	product_cta_headline?: string | null;
	/** @description Italic emphasis suffix for the product CTA headline. */
	product_cta_emphasis?: string | null;
	/** @description Product catalogue image for the product CTA. */
	product_catalogue_image?: DirectusFile | string | null;
	/** @description Optional featured post to highlight for this service. */
	featured_post?: Post | string | null;
	/** @description Expertise / capability cards. */
	cards?: BlockServiceShowcaseItemCard[] | string[];
	/** @description Key statistics for this service. */
	stat_items?: BlockServiceShowcaseItemStat[] | string[];
	/** @description Product list items for the product CTA. */
	product_items?: BlockServiceShowcaseItemProduct[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface BlockServiceShowcase {
	/** @primaryKey */
	id: string;
	sort?: number | null;
	/** @description Main page headline (dark header). */
	page_headline?: string | null;
	/** @description Italic emphasis suffix rendered after page_headline. */
	page_headline_emphasis?: string | null;
	/** @description Supporting description below the main headline. */
	page_description?: string | null;
	/** @description Individual service items (one per tab). */
	items?: BlockServiceShowcaseItem[] | string[];
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface Redirect {
	/** @primaryKey */
	id: string;
	response_code?: '301' | '302' | null;
	/** @description Old URL has to be relative to the site (ie `/blog` or `/news`). It cannot be a full url like (https://example.com/blog) */
	url_from?: string | null;
	/** @description The URL you're redirecting to. This can be a relative url (/resources/matt-is-cool) or a full url (https://example.com/blog). */
	url_to?: string | null;
	/** @description Short explanation of why the redirect was created. */
	note?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	date_updated?: string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusAccess {
	/** @primaryKey */
	id: string;
	role?: DirectusRole | string | null;
	user?: DirectusUser | string | null;
	policy?: DirectusPolicy | string;
	sort?: number | null;
}

export interface DirectusActivity {
	/** @primaryKey */
	id: number;
	action?: string;
	user?: DirectusUser | string | null;
	timestamp?: string;
	ip?: string | null;
	user_agent?: string | null;
	collection?: string;
	item?: string;
	origin?: string | null;
	revisions?: DirectusRevision[] | string[];
}

export interface DirectusCollection {
	/** @primaryKey */
	collection: string;
	icon?: string | null;
	note?: string | null;
	display_template?: string | null;
	hidden?: boolean;
	singleton?: boolean;
	translations?: Array<{ language: string; translation: string; singular: string; plural: string }> | null;
	archive_field?: string | null;
	archive_app_filter?: boolean;
	archive_value?: string | null;
	unarchive_value?: string | null;
	sort_field?: string | null;
	accountability?: 'all' | 'activity' | null | null;
	color?: string | null;
	item_duplication_fields?: 'json' | null;
	sort?: number | null;
	group?: DirectusCollection | string | null;
	collapse?: string;
	preview_url?: string | null;
	versioning?: boolean;
}

export interface DirectusComment {
	/** @primaryKey */
	id: string;
	collection?: DirectusCollection | string;
	item?: string;
	comment?: string;
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
}

export interface DirectusField {
	/** @primaryKey */
	id: number;
	collection?: DirectusCollection | string;
	field?: string;
	special?: string[] | null;
	interface?: string | null;
	options?: 'json' | null;
	display?: string | null;
	display_options?: 'json' | null;
	readonly?: boolean;
	hidden?: boolean;
	sort?: number | null;
	width?: string | null;
	translations?: 'json' | null;
	note?: string | null;
	conditions?: 'json' | null;
	required?: boolean | null;
	group?: DirectusField | string | null;
	validation?: 'json' | null;
	validation_message?: string | null;
}

export interface DirectusFile {
	/** @primaryKey */
	id: string;
	storage?: string;
	filename_disk?: string | null;
	filename_download?: string;
	title?: string | null;
	type?: string | null;
	folder?: DirectusFolder | string | null;
	uploaded_by?: DirectusUser | string | null;
	created_on?: string;
	modified_by?: DirectusUser | string | null;
	modified_on?: string;
	charset?: string | null;
	filesize?: number | null;
	width?: number | null;
	height?: number | null;
	duration?: number | null;
	embed?: string | null;
	description?: string | null;
	location?: string | null;
	tags?: string[] | null;
	metadata?: 'json' | null;
	focal_point_x?: number | null;
	focal_point_y?: number | null;
	tus_id?: string | null;
	tus_data?: 'json' | null;
	uploaded_on?: string | null;
}

export interface DirectusFolder {
	/** @primaryKey */
	id: string;
	name?: string;
	parent?: DirectusFolder | string | null;
}

export interface DirectusMigration {
	/** @primaryKey */
	version: string;
	name?: string;
	timestamp?: string | null;
}

export interface DirectusPermission {
	/** @primaryKey */
	id: number;
	collection?: string;
	action?: string;
	permissions?: 'json' | null;
	validation?: 'json' | null;
	presets?: 'json' | null;
	fields?: string[] | null;
	policy?: DirectusPolicy | string;
}

export interface DirectusPolicy {
	/** @primaryKey */
	id: string;
	/** @required */
	name: string;
	icon?: string;
	description?: string | null;
	ip_access?: string[] | null;
	enforce_tfa?: boolean;
	admin_access?: boolean;
	app_access?: boolean;
	permissions?: DirectusPermission[] | string[];
	users?: DirectusAccess[] | string[];
	roles?: DirectusAccess[] | string[];
}

export interface DirectusPreset {
	/** @primaryKey */
	id: number;
	bookmark?: string | null;
	user?: DirectusUser | string | null;
	role?: DirectusRole | string | null;
	collection?: string | null;
	search?: string | null;
	layout?: string | null;
	layout_query?: 'json' | null;
	layout_options?: 'json' | null;
	refresh_interval?: number | null;
	filter?: 'json' | null;
	icon?: string | null;
	color?: string | null;
}

export interface DirectusRelation {
	/** @primaryKey */
	id: number;
	many_collection?: string;
	many_field?: string;
	one_collection?: string | null;
	one_field?: string | null;
	one_collection_field?: string | null;
	one_allowed_collections?: string[] | null;
	junction_field?: string | null;
	sort_field?: string | null;
	one_deselect_action?: string;
}

export interface DirectusRevision {
	/** @primaryKey */
	id: number;
	activity?: DirectusActivity | string;
	collection?: string;
	item?: string;
	data?: 'json' | null;
	delta?: 'json' | null;
	parent?: DirectusRevision | string | null;
	version?: DirectusVersion | string | null;
}

export interface DirectusRole {
	/** @primaryKey */
	id: string;
	/** @required */
	name: string;
	icon?: string;
	description?: string | null;
	parent?: DirectusRole | string | null;
	children?: DirectusRole[] | string[];
	policies?: DirectusAccess[] | string[];
	users?: DirectusUser[] | string[];
}

export interface DirectusSession {
	/** @primaryKey */
	token: string;
	user?: DirectusUser | string | null;
	expires?: string;
	ip?: string | null;
	user_agent?: string | null;
	share?: DirectusShare | string | null;
	origin?: string | null;
	next_token?: string | null;
}

export interface DirectusSettings {
	/** @primaryKey */
	id: number;
	project_name?: string;
	project_url?: string | null;
	project_color?: string;
	project_logo?: DirectusFile | string | null;
	public_foreground?: DirectusFile | string | null;
	public_background?: DirectusFile | string | null;
	public_note?: string | null;
	auth_login_attempts?: number | null;
	auth_password_policy?:
		| null
		| `/^.{8,}$/`
		| `/(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{';'?>.<,])(?!.*\\s).*$/`
		| null;
	storage_asset_transform?: 'all' | 'none' | 'presets' | null;
	storage_asset_presets?: Array<{
		key: string;
		fit: 'contain' | 'cover' | 'inside' | 'outside';
		width: number;
		height: number;
		quality: number;
		withoutEnlargement: boolean;
		format: 'auto' | 'jpeg' | 'png' | 'webp' | 'tiff' | 'avif';
		transforms: 'json';
	}> | null;
	custom_css?: string | null;
	storage_default_folder?: DirectusFolder | string | null;
	basemaps?: Array<{
		name: string;
		type: 'raster' | 'tile' | 'style';
		url: string;
		tileSize: number;
		attribution: string;
	}> | null;
	mapbox_key?: string | null;
	module_bar?: 'json' | null;
	project_descriptor?: string | null;
	default_language?: string;
	custom_aspect_ratios?: Array<{ text: string; value: number }> | null;
	public_favicon?: DirectusFile | string | null;
	default_appearance?: 'auto' | 'light' | 'dark';
	default_theme_light?: string | null;
	theme_light_overrides?: 'json' | null;
	default_theme_dark?: string | null;
	theme_dark_overrides?: 'json' | null;
	report_error_url?: string | null;
	report_bug_url?: string | null;
	report_feature_url?: string | null;
	public_registration?: boolean;
	public_registration_verify_email?: boolean;
	public_registration_role?: DirectusRole | string | null;
	public_registration_email_filter?: 'json' | null;
	visual_editor_urls?: Array<{ url: string }> | null;
	/** @description Settings for the Command Palette Module. */
	command_palette_settings?: Record<string, any> | null;
	accepted_terms?: boolean | null;
	project_id?: string | null;
}

export interface DirectusUser {
	/** @primaryKey */
	id: string;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	password?: string | null;
	location?: string | null;
	title?: string | null;
	description?: string | null;
	tags?: string[] | null;
	avatar?: DirectusFile | string | null;
	language?: string | null;
	tfa_secret?: string | null;
	status?: 'draft' | 'invited' | 'unverified' | 'active' | 'suspended' | 'archived';
	role?: DirectusRole | string | null;
	token?: string | null;
	last_access?: string | null;
	last_page?: string | null;
	provider?: string;
	external_identifier?: string | null;
	auth_data?: 'json' | null;
	email_notifications?: boolean | null;
	appearance?: null | 'auto' | 'light' | 'dark' | null;
	theme_dark?: string | null;
	theme_light?: string | null;
	theme_light_overrides?: 'json' | null;
	theme_dark_overrides?: 'json' | null;
	text_direction?: 'auto' | 'ltr' | 'rtl';
	/** @description Blog posts this user has authored. */
	posts?: Post[] | string[];
	policies?: DirectusAccess[] | string[];
}

export interface DirectusWebhook {
	/** @primaryKey */
	id: number;
	name?: string;
	method?: null;
	url?: string;
	status?: 'active' | 'inactive';
	data?: boolean;
	actions?: 'create' | 'update' | 'delete';
	collections?: string[];
	headers?: Array<{ header: string; value: string }> | null;
	was_active_before_deprecation?: boolean;
	migrated_flow?: DirectusFlow | string | null;
}

export interface DirectusDashboard {
	/** @primaryKey */
	id: string;
	name?: string;
	icon?: string;
	note?: string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	color?: string | null;
	panels?: DirectusPanel[] | string[];
}

export interface DirectusPanel {
	/** @primaryKey */
	id: string;
	dashboard?: DirectusDashboard | string;
	name?: string | null;
	icon?: string | null;
	color?: string | null;
	show_header?: boolean;
	note?: string | null;
	type?: string;
	position_x?: number;
	position_y?: number;
	width?: number;
	height?: number;
	options?: 'json' | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
}

export interface DirectusNotification {
	/** @primaryKey */
	id: number;
	timestamp?: string | null;
	status?: string | null;
	recipient?: DirectusUser | string;
	sender?: DirectusUser | string | null;
	subject?: string;
	message?: string | null;
	collection?: string | null;
	item?: string | null;
}

export interface DirectusShare {
	/** @primaryKey */
	id: string;
	name?: string | null;
	collection?: DirectusCollection | string;
	item?: string;
	role?: DirectusRole | string | null;
	password?: string | null;
	user_created?: DirectusUser | string | null;
	date_created?: string | null;
	date_start?: string | null;
	date_end?: string | null;
	times_used?: number | null;
	max_uses?: number | null;
}

export interface DirectusFlow {
	/** @primaryKey */
	id: string;
	name?: string;
	icon?: string | null;
	color?: string | null;
	description?: string | null;
	status?: string;
	trigger?: string | null;
	accountability?: string | null;
	options?: 'json' | null;
	operation?: DirectusOperation | string | null;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
	operations?: DirectusOperation[] | string[];
}

export interface DirectusOperation {
	/** @primaryKey */
	id: string;
	name?: string | null;
	key?: string;
	type?: string;
	position_x?: number;
	position_y?: number;
	options?: 'json' | null;
	resolve?: DirectusOperation | string | null;
	reject?: DirectusOperation | string | null;
	flow?: DirectusFlow | string;
	date_created?: string | null;
	user_created?: DirectusUser | string | null;
}

export interface DirectusTranslation {
	/** @primaryKey */
	id: string;
	/** @required */
	language: string;
	/** @required */
	key: string;
	/** @required */
	value: string;
}

export interface DirectusVersion {
	/** @primaryKey */
	id: string;
	key?: string;
	name?: string | null;
	collection?: DirectusCollection | string;
	item?: string;
	hash?: string | null;
	date_created?: string | null;
	date_updated?: string | null;
	user_created?: DirectusUser | string | null;
	user_updated?: DirectusUser | string | null;
	delta?: 'json' | null;
}

export interface DirectusExtension {
	enabled?: boolean;
	/** @primaryKey */
	id: string;
	folder?: string;
	source?: string;
	bundle?: string | null;
}

export interface Schema {
	ai_prompts: AiPrompt[];
	block_button: BlockButton[];
	block_button_group: BlockButtonGroup[];
	block_form: BlockForm[];
	block_gallery: BlockGallery[];
	block_gallery_items: BlockGalleryItem[];
	block_hero: BlockHero[];
	block_hero_headline_line: BlockHeroHeadlineLine[];
	block_hero_slide: BlockHeroSlide[];
	block_posts: BlockPost[];
	block_pricing: BlockPricing[];
	block_pricing_cards: BlockPricingCard[];
	block_reach_out: BlockReachOut[];
	block_acknowledgement: BlockAcknowledgement[];
	block_culture_gallery: BlockCultureGallery[];
	block_reach_out_contact_item: BlockReachOutContactItem[];
	block_values: BlockValues[];
	block_values_item: BlockValuesItem[];
	block_people_say: BlockPeopleSay[];
	block_people_say_slide: BlockPeopleSaySlide[];
	block_intro_media: BlockIntroMedia[];
	block_open_roles: BlockOpenRoles[];
	block_open_roles_job: BlockOpenRolesJob[];
	block_cta_split: BlockCtaSplit[];
	block_richtext: BlockRichtext[];
	block_services: BlockServices[];
	block_services_item: BlockServicesItem[];
	block_featured_post: BlockFeaturedPost[];
	block_featured_post_recommended_posts: BlockFeaturedPostRecommendedPost[];
	block_service_featured_article: BlockServiceFeaturedArticle[];
	block_service_credentials_cta: BlockServiceCredentialsCTA[];
	block_service_credentials_cta_badge: BlockServiceCredentialsCTABadge[];
	block_service_credentials_cta_stat: BlockServiceCredentialsCTAStat[];
	block_service_product_catalogue: BlockServiceProductCatalogue[];
	block_service_product_catalogue_item: BlockServiceProductCatalogueItem[];
	block_service_tabs: BlockServiceTabs[];
	block_service_tabs_items: BlockServiceTabsItem[];
	block_service_showcase: BlockServiceShowcase[];
	block_service_showcase_items: BlockServiceShowcaseItem[];
	block_service_showcase_item_cards: BlockServiceShowcaseItemCard[];
	block_service_showcase_item_stats: BlockServiceShowcaseItemStat[];
	block_service_showcase_item_products: BlockServiceShowcaseItemProduct[];
	block_card_grid: BlockCardGrid[];
	block_card_grid_item: BlockCardGridItem[];
	form_fields: FormField[];
	forms: Form[];
	form_submissions: FormSubmission[];
	form_submission_values: FormSubmissionValue[];
	globals: Globals;
	navigation: Navigation[];
	navigation_items: NavigationItem[];
	page_blocks: PageBlock[];
	pages: Page[];
	posts: Post[];
	redirects: Redirect[];
	directus_access: DirectusAccess[];
	directus_activity: DirectusActivity[];
	directus_collections: DirectusCollection[];
	directus_comments: DirectusComment[];
	directus_fields: DirectusField[];
	directus_files: DirectusFile[];
	directus_folders: DirectusFolder[];
	directus_migrations: DirectusMigration[];
	directus_permissions: DirectusPermission[];
	directus_policies: DirectusPolicy[];
	directus_presets: DirectusPreset[];
	directus_relations: DirectusRelation[];
	directus_revisions: DirectusRevision[];
	directus_roles: DirectusRole[];
	directus_sessions: DirectusSession[];
	directus_settings: DirectusSettings;
	directus_users: DirectusUser[];
	directus_webhooks: DirectusWebhook[];
	directus_dashboards: DirectusDashboard[];
	directus_panels: DirectusPanel[];
	directus_notifications: DirectusNotification[];
	directus_shares: DirectusShare[];
	directus_flows: DirectusFlow[];
	directus_operations: DirectusOperation[];
	directus_translations: DirectusTranslation[];
	directus_versions: DirectusVersion[];
	directus_extensions: DirectusExtension[];
}

export enum CollectionNames {
	ai_prompts = 'ai_prompts',
	block_button = 'block_button',
	block_button_group = 'block_button_group',
	block_form = 'block_form',
	block_gallery = 'block_gallery',
	block_gallery_items = 'block_gallery_items',
	block_hero = 'block_hero',
	block_hero_slide = 'block_hero_slide',
	block_posts = 'block_posts',
	block_pricing = 'block_pricing',
	block_pricing_cards = 'block_pricing_cards',
	block_richtext = 'block_richtext',
	block_card_grid = 'block_card_grid',
	block_card_grid_item = 'block_card_grid_item',
	form_fields = 'form_fields',
	forms = 'forms',
	form_submissions = 'form_submissions',
	form_submission_values = 'form_submission_values',
	globals = 'globals',
	navigation = 'navigation',
	navigation_items = 'navigation_items',
	page_blocks = 'page_blocks',
	pages = 'pages',
	posts = 'posts',
	redirects = 'redirects',
	directus_access = 'directus_access',
	directus_activity = 'directus_activity',
	directus_collections = 'directus_collections',
	directus_comments = 'directus_comments',
	directus_fields = 'directus_fields',
	directus_files = 'directus_files',
	directus_folders = 'directus_folders',
	directus_migrations = 'directus_migrations',
	directus_permissions = 'directus_permissions',
	directus_policies = 'directus_policies',
	directus_presets = 'directus_presets',
	directus_relations = 'directus_relations',
	directus_revisions = 'directus_revisions',
	directus_roles = 'directus_roles',
	directus_sessions = 'directus_sessions',
	directus_settings = 'directus_settings',
	directus_users = 'directus_users',
	directus_webhooks = 'directus_webhooks',
	directus_dashboards = 'directus_dashboards',
	directus_panels = 'directus_panels',
	directus_notifications = 'directus_notifications',
	directus_shares = 'directus_shares',
	directus_flows = 'directus_flows',
	directus_operations = 'directus_operations',
	directus_translations = 'directus_translations',
	directus_versions = 'directus_versions',
	directus_extensions = 'directus_extensions',
}
