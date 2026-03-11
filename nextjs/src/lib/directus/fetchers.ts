import { BlockPost, Page, PageBlock, Post, Redirect, Schema } from '@/types/directus-schema';
import { useDirectus } from './directus';
import { readItems, aggregate, readItem, readSingleton, withToken, QueryFilter } from '@directus/sdk';
import { RedirectError } from '../redirects';

/**
 * Page fields configuration for Directus queries
 *
 * This defines the complete field structure for pages including:
 * - Basic page metadata (title, id)
 * - SEO fields for search engine optimization
 * - Complex nested content blocks (hero, gallery, pricing, forms, etc.)
 * - All nested relationships and dynamic content fields
 */
const pageFields = [
	'title',
	'seo',
	'id',
	'nav_overlay_mode',
	'nav_background_color',
	'nav_text_color',
	'nav_text_hover_color',
	'nav_scrolled_background_color',
	'nav_scrolled_text_color',
	'nav_scrolled_text_hover_color',
	'nav_dropdown_background_color',
	'nav_dropdown_text_color',
	'nav_dropdown_text_hover_color',
	'nav_logo_override',
	'nav_cta_background_color',
	'nav_cta_text_color',
	'nav_scrolled_cta_background_color',
	'nav_scrolled_cta_text_color',
	'nav_active_text_color',
	'nav_active_underline_color',
	'nav_scrolled_active_text_color',
	'nav_scrolled_active_underline_color',
	'footer_cta_text',
	'footer_cta_button_text',
	'footer_cta_button_url',
	{ footer_cta_button_page: ['permalink'] },
	{
		blocks: [
			'id',
			'background',
			'collection',
			'item',
			'sort',
			'hide_block',
			{
				item: {
					// Use '*' for simple blocks (no nested relations needing traversal)
					block_posts: ['*'],
					block_insights: ['*'],
					block_acknowledgement: ['*'],
					block_cta_split: ['*'],
					block_intro_media: ['*'],
					block_culture_gallery: ['*'],
					block_all_posts: ['*'],

					// Blocks with nested relations need explicit field paths
					block_richtext: ['*', { button_page: ['permalink'] }],
					block_gallery: ['*', { items: ['id', 'directus_file', 'sort'] }],
					block_pricing: ['*', { pricing_cards: ['*', { button: ['*', { page: ['permalink'] }, { post: ['slug'] }] }] }],
					block_hero: [
						'*',
						{ headline_lines: ['*'] },
						{ button_group: ['*', { buttons: ['*', { page: ['permalink'] }, { post: ['slug'] }] }] },
						{ slides: ['*', { button_1_page: ['permalink'] }, { button_2_page: ['permalink'] }] },
					],
					block_testimonials: ['*', { stats: ['*'] }, { testimonials: ['*'] }],
					block_feature_split: ['*', { items: ['*'] }],
					block_logo_carousel: ['*', { logos: ['*'] }],
					block_services: ['*', { items: ['*'] }],
					block_credentials: ['*', { badges: ['*'] }],
					block_card_grid: ['*', { items: ['*'] }],
					block_reach_out: ['*', { form: ['*', { fields: ['*'] }] }, { contact_items: ['*'] }],
					block_form: ['*', { form: ['*', { fields: ['*'] }] }],
					block_open_roles: ['*', { jobs: ['*', { form: ['*', { fields: ['*'] }] }] }],
					block_people_say: ['*', { slides: ['*'] }],
					block_content_tabs: ['*', { tabs: ['*', { speakers: ['*'] }] }],
					block_values: ['*', { value_items: ['*'] }],
					block_posts_carousel: ['id','headline','description',{posts: ['sort',{ posts_id: ['id', 'title', 'slug', 'image', 'description', 'type'] }] }],
					block_featured_post: [
						'id',
						'tagline',
						'background_color',
						'image',
						'special_post_title',
						{
							special_post: ['id', 'title', 'slug', 'type'],
						},
						{
							recommended_posts: ['sort', { posts_id: ['id', 'title', 'slug', 'type'] }],
						},
					],
					block_service_tabs: [
						'id',
						'tagline',
						'headline',
						{
							items: [
								'id',
								'sort',
								'label',
								'accent_color',
								'headline',
								'description',
								'image',
								'link_label',
								'url',
							],
						},
					],
					block_service_platform_banner: ['id', 'title', 'description', 'cta_label', 'cta_url', 'image'],
		
					block_service_featured_article: [
						'id',
						'tagline',
						'headline',
						'cta_label',
						'cta_url',
						'image',
						'image_alt',
						'background_color',
					],
					block_services_tab: [
						'id',
						'description',
						'heading',
						{
							items: [
								'id',
								'sort',
								'title',
								'accent_color',
								'key_services',
								'cta_type',
								{
									panel: [
										'id',
										'subtitle',
										'description',
										'image',
									],
								},
								{
									expertise_cards: [
										'id',
										'heading',
										{
											cards: [
												'id', 'sort', 'icon',
												'title', 'description',
												'link_label', 'url',
											],
										},
									],
								},
								{
									featured_article: [
										'id', 'tagline', 'headline',
										'cta_label', 'cta_url',
										'image', 'image_alt', 'background_color',
									],
								},
								{
									credentials_cta: [
										'id',
										'headline',
								
										{ badges: ['id', 'sort', 'image', 'alt'] },
										{ stats: ['id', 'sort', 'icon', 'value', 'label' , 'color'] },
									],
								},
								{
									product_catalogue: [
										'id',
										'headline',
										'image',
										'image_alt',
										{ products: ['id', 'sort', 'label'] },
									],
								},
							],
						},
					],
				
					block_service_product_catalogue: [
						'id',
						'headline',	
						'image',
						'image_alt',
						{ products: ['id', 'sort', 'label'] },
					],
					block_service_credentials_cta: [
						'id',
						'headline',
						{ badges: ['id', 'sort', 'image', 'alt'] },
						{ stats: ['id', 'sort', 'icon', 'value', 'label' , 'color'] },
					],
					
				},
			},
		],
	},
];

/**
 * Fetches page data by permalink, including all nested blocks and dynamically fetching blog posts if required.
 */
export const fetchPageData = async (permalink: string, postPage = 1, token?: string, preview?: boolean) => {
	const { directus } = useDirectus();

	try {
		const query = readItems<Schema, 'pages', any>('pages', {
			filter:
				preview && token
					? { permalink: { _eq: permalink } }
					: { permalink: { _eq: permalink }, status: { _eq: 'published' } },
			limit: 1,
			fields: pageFields as any,
			deep: {
				blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
			},
		});
		const pageData = (await directus.request(
			token ? withToken(token, query) : query,
		)) as unknown as Page[];

		if (!pageData.length) {
			throw new Error('Page not found');
		}

		const page = pageData[0];

		// Dynamic Content Enhancement:
		// Some blocks need additional data fetched at runtime
		// This is where we enhance static block data with dynamic content
		if (Array.isArray(page.blocks)) {
			for (const block of page.blocks as PageBlock[]) {
				// Handle dynamic posts blocks - these blocks display a list of posts
				// The posts are fetched dynamically based on the block's configuration
				if (
					block.collection === 'block_posts' &&
					block.item &&
					typeof block.item !== 'string' &&
					'collection' in block.item &&
					block.item.collection === 'posts'
				) {
					const blockPost = block.item as BlockPost;
					const limit = blockPost.limit ?? 6; // Default to 6 posts if no limit specified

					// Fetch the actual posts data for this block
					// Always fetch published posts only (no preview mode for dynamic content)
					const posts: Post[] = await directus.request(
						readItems('posts', {
							fields: ['id', 'title', 'description', 'slug', 'image', 'published_at'],
							filter: { status: { _eq: 'published' } },
							sort: ['-published_at'],
							limit,
							page: postPage,
						}),
					);

					// Attach the fetched posts to the block for frontend rendering
					(block.item as BlockPost & { posts: Post[] }).posts = posts;
				}

				// block_insights — fetch published posts dynamically
				if (block.collection === 'block_insights' && block.item && typeof block.item !== 'string') {
					const limit = (block.item as any).limit ?? 4;
					const insightsPosts: Post[] = await directus.request(
						readItems('posts', {
							fields: ['id', 'title', 'description', 'slug', 'image', 'published_at'],
							filter: { status: { _eq: 'published' } },
							sort: ['-published_at'],
							limit,
						}),
					);
					(block.item as any).posts = insightsPosts;
				}

				// block_featured_post — if no pinned post, fetch the latest published post
				// also resolve recommended posts: use manually selected if set, otherwise fetch latest
				if (block.collection === 'block_featured_post' && block.item && typeof block.item !== 'string') {
					const pinnedPost = (block.item as any).special_post;
					const pinnedPostId = pinnedPost ? pinnedPost.id ?? pinnedPost : null;

					if (!pinnedPost) {
						const latestPosts: Post[] = await directus.request(
							readItems('posts', {
								fields: ['id', 'title', 'slug', 'type'],
								filter: { status: { _eq: 'published' } },
								sort: ['-published_at'],
								limit: 1,
							}),
						);
						(block.item as any).special_post = latestPosts[0] ?? null;
					}

					// Use manually selected recommended posts if set; otherwise auto-fetch latest (excluding featured)
					const manualRecs = (block.item as any).recommended_posts as Array<{ sort: number; posts_id: any }> | null | undefined;
					if (manualRecs && manualRecs.length > 0) {
						(block.item as any).recommended_posts = [...manualRecs]
							.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
							.map((j) => j.posts_id)
							.filter(Boolean);
					} else {
						const excludeFilter: QueryFilter<Schema, Post> = pinnedPostId
							? { status: { _eq: 'published' as const }, id: { _neq: pinnedPostId } }
							: { status: { _eq: 'published' as const } };

						const recommendedPosts = await directus.request<Post[]>(
							readItems<Schema, 'posts', any>('posts', {
								fields: ['id', 'title', 'slug', 'type'],
								filter: excludeFilter,
								sort: ['-published_at'],
								limit: 4,
							}),
						);
						(block.item as any).recommended_posts = recommendedPosts;
					}
				}
				// block_posts_carousel — use manually selected posts from M2M relation
				if (block.collection === 'block_posts_carousel' && block.item && typeof block.item !== 'string') {
					const item = block.item as any;
					const junctionPosts = item.posts as Array<{ sort: number; posts_id: any }> | null | undefined;
					item.posts = junctionPosts
						? [...junctionPosts]
							.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
							.map((j) => j.posts_id)
							.filter(Boolean)
						: [];
				}
				// block_all_posts — fetch all published posts with type + service for client-side filtering
				if (block.collection === 'block_all_posts' && block.item && typeof block.item !== 'string') {
					const [allPosts, serviceItems] = await Promise.all([
						directus.request(
							readItems('posts', {
								fields: ['id', 'title', 'slug', 'image', 'description', 'type', { service: ['id', 'title'] } as any],
								filter: { status: { _eq: 'published' } },
								sort: ['-published_at'],
								limit: -1,
							}),
						),
						directus.request(
							readItems('block_services_item', {
								fields: ['id', 'title'],
								sort: ['sort'],
								limit: -1,
							}),
						),
					]);
					(block.item as any).posts = allPosts;
					(block.item as any).services = serviceItems;
				}
			}
		}

		return page;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Error('Failed to fetch page data');
	}
};

/**
 * Fetches page data by id and version
 */
export const fetchPageDataById = async (id: string, version?: string, token?: string): Promise<Page> => {
	if (!id || id.trim() === '') {
		throw new Error('Invalid id: id must be a non-empty string');
	}
	if (!version || version.trim() === '') {
		throw new Error('Invalid version: version must be a non-empty string');
	}

	const { directus } = useDirectus();

	try {
		return (await directus.request(
			withToken(
				token as string,
				readItem('pages', id, {
					version,
					fields: pageFields as any,
					deep: {
						blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
					},
				}),
			),
		)) as Page;
	} catch (error) {
		console.error('Error fetching versioned page:', error);
		throw new Error('Failed to fetch versioned page');
	}
};

/**
 * Helper function to get page ID by permalink
 */
export const getPageIdByPermalink = async (permalink: string, token?: string) => {
	if (!permalink || permalink.trim() === '') {
		throw new Error('Invalid permalink: permalink must be a non-empty string');
	}

	const { directus } = useDirectus();

	try {
		const query = readItems<Schema, 'pages', any>('pages', {
			filter: { permalink: { _eq: permalink } },
			limit: 1,
			fields: ['id'],
		});
		const pageData = (await directus.request(
			token ? withToken(token, query) : query,
		)) as unknown as Pick<Page, 'id'>[];

		return pageData.length > 0 ? pageData[0].id : null;
	} catch (error) {
		console.error('Error getting page ID:', error);

		return null;
	}
};

/**
 * Helper function to get post ID by slug
 */
export const getPostIdBySlug = async (slug: string, token?: string) => {
	if (!slug || slug.trim() === '') {
		throw new Error('Invalid slug: slug must be a non-empty string');
	}

	const { directus } = useDirectus();

	try {
		const query = readItems<Schema, 'posts', any>('posts', {
			filter: { slug: { _eq: slug } },
			limit: 1,
			fields: ['id'],
		});
		const postData = (await directus.request(
			token ? withToken(token, query) : query,
		)) as unknown as Pick<Post, 'id'>[];

		return postData.length > 0 ? postData[0].id : null;
	} catch (error) {
		console.error('Error getting post ID:', error);

		return null;
	}
};

/**
 * Fetches a single blog post by ID and version
 */
export const fetchPostByIdAndVersion = async (
	id: string,
	version: string,
	slug: string,
	token?: string,
): Promise<{ post: Post; relatedPosts: Post[] }> => {
	if (!id || id.trim() === '') {
		throw new Error('Invalid id: id must be a non-empty string');
	}
	if (!version || version.trim() === '') {
		throw new Error('Invalid version: version must be a non-empty string');
	}
	if (!slug || slug.trim() === '') {
		throw new Error('Invalid slug: slug must be a non-empty string');
	}

	const { directus } = useDirectus();

	try {
		const [postData, relatedPosts] = await Promise.all([
			directus.request(
				withToken(
					token as string,
					readItem('posts', id, {
						version,
						fields: [
							'id',
							'title',
							'content',
							'status',
							'published_at',
							'image',
							'description',
							'slug',
							'seo',
							{
								author: ['id', 'first_name', 'last_name', 'avatar'],
							},
						],
					}),
				),
			),
			directus.request(
				readItems('posts', {
					filter: { slug: { _neq: slug }, status: { _eq: 'published' } },
					limit: 2,
					fields: ['id', 'title', 'slug', 'image'],
				}),
			),
		]);

		return { post: postData as Post, relatedPosts: relatedPosts as Post[] };
	} catch (error) {
		console.error('Error fetching versioned post:', error);
		throw new Error('Failed to fetch versioned post');
	}
};

/**
 * Fetches global site data, header navigation, and footer navigation.
 */
export const fetchSiteData = async () => {
	const { directus } = useDirectus();

	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directus.request(
				readSingleton('globals', {
					fields: ['id', 'title', 'description', 'logo', 'logo_dark_mode', 'social_links', 'accent_color', 'favicon'],
				}),
			),
			directus.request(
				readItem('navigation', 'main', {
					fields: [
						'id',
						'title',
						'active_text_color',
						'active_underline_color',
						'scrolled_active_text_color',
						'scrolled_active_underline_color',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }],
								},
							],
						},
					],
					deep: { items: { _sort: ['sort'] } },
				}),
			),
			directus.request(
				readItem('navigation', 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }],
								},
							],
						},
					],
				}),
			),
		]);

		return { globals, headerNavigation, footerNavigation };
	} catch (error) {
		console.error('Error fetching site data:', error);
		throw new Error('Failed to fetch site data');
	}
};

/**
 * Fetches a single blog post by slug and related blog posts excluding the given ID. Handles live preview mode.
 */
export const fetchPostBySlug = async (
	slug: string,
	options?: { draft?: boolean; token?: string },
): Promise<{ post: Post | null; relatedPosts: Post[] }> => {
	const { directus } = useDirectus();
	const { draft, token } = options || {};

	try {
		const filter: QueryFilter<Schema, Post> =
			token || draft ? { slug: { _eq: slug } } : { slug: { _eq: slug }, status: { _eq: 'published' } };

		const postsQuery = readItems<Schema, 'posts', any>('posts', {
			filter,
			limit: 1,
			fields: [
				'id',
				'title',
				'content',
				'status',
				'published_at',
				'image',
				'description',
				'slug',
				'seo',
				{
					author: ['id', 'first_name', 'last_name', 'avatar'],
				},
			],
		});
		const relatedQuery = readItems<Schema, 'posts', any>('posts', {
			filter: { slug: { _neq: slug }, status: { _eq: 'published' } },
			limit: 2,
			fields: ['id', 'title', 'slug', 'image'],
		});
		const [posts, relatedPosts] = await Promise.all([
			directus.request<Post[]>(token ? withToken(token, postsQuery) : postsQuery),
			directus.request<Post[]>(token ? withToken(token, relatedQuery) : relatedQuery),
		]);

		const post: Post | null = posts.length > 0 ? (posts[0] as Post) : null;

		return { post, relatedPosts };
	} catch (error) {
		console.error('Error in fetchPostBySlug:', error);
		throw new Error('Failed to fetch blog post and related posts');
	}
};

/**
 * Fetches paginated blog posts.
 */
export const fetchPaginatedPosts = async (limit: number, page: number): Promise<Post[]> => {
	const { directus } = useDirectus();
	try {
		const response = (await directus.request(
			readItems('posts', {
				limit,
				page,
				sort: ['-published_at'],
				fields: ['id', 'title', 'description', 'slug', 'image'],
				filter: { status: { _eq: 'published' } },
			}),
		)) as Post[];

		return response;
	} catch (error) {
		console.error('Error fetching paginated posts:', error);
		throw new Error('Failed to fetch paginated posts');
	}
};

/**
 * Fetches the total number of published blog posts.
 */
export const fetchTotalPostCount = async (): Promise<number> => {
	const { directus } = useDirectus();

	try {
		const response = await directus.request(
			aggregate('posts', {
				aggregate: { count: '*' },
				filter: { status: { _eq: 'published' } },
			}),
		);

		return Number(response[0]?.count) || 0;
	} catch (error) {
		console.error('Error fetching total post count:', error);

		return 0;
	}
};

export async function fetchRedirects(): Promise<Pick<Redirect, 'url_from' | 'url_to' | 'response_code'>[]> {
	const { directus } = useDirectus();
	const response = await directus.request(
		readItems('redirects', {
			filter: {
				_and: [
					{
						url_from: { _nnull: true },
					},
					{
						url_to: { _nnull: true },
					},
				],
			},
			fields: ['url_from', 'url_to', 'response_code'],
		}),
	);

	return response || [];
}

/**
 * Fetches a single job posting from block_open_roles_job by its slug.
 */
export const fetchJobBySlug = async (slug: string) => {
	const { directus } = useDirectus();

	try {
		const results = await directus.request(
			readItems<Schema, 'block_open_roles_job', any>('block_open_roles_job', {
				filter: { slug: { _eq: slug } },
				limit: 1,
				fields: [
					'id',
					'title',
					'type',
					'department',
					'location',
					'location_flag',
					'slug',
					'overview',
					'responsibilities',
					'requirements',
					{ form: ['*', { fields: ['*'] }] },
				],
			}),
		);

		return (results as any[])[0] ?? null;
	} catch (error) {
		console.error('Error fetching job by slug:', error);

		return null;
	}
};
