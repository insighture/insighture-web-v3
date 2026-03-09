'use client';

import dynamic from 'next/dynamic';

const components: Record<string, React.ComponentType<any>> = {
	block_hero: dynamic(() => import('@/components/blocks/Hero')),
	block_richtext: dynamic(() => import('@/components/blocks/RichText')),
	block_gallery: dynamic(() => import('@/components/blocks/Gallery')),
	block_pricing: dynamic(() => import('@/components/blocks/Pricing')),
	block_posts: dynamic(() => import('@/components/blocks/Posts')),
	block_form: dynamic(() => import('@/components/blocks/Form')),
	block_services: dynamic(() => import('@/components/blocks/Services')),
	block_testimonials: dynamic(() => import('@/components/blocks/Testimonials')),
	block_logo_carousel: dynamic(() => import('@/components/blocks/LogoCarousel')),
	block_feature_split: dynamic(() => import('@/components/blocks/FeatureSplit')),
	block_insights: dynamic(() => import('@/components/blocks/Insights')),
	block_credentials: dynamic(() => import('@/components/blocks/Credentials')),
	block_featured_post: dynamic(() => import('@/components/blocks/BlogFeaturedPost')),
	block_posts_carousel: dynamic(() => import('./PostsCarousel')),
	block_all_posts: dynamic(() => import('./AllPostsGrid')),
	block_service_featured_article: dynamic(() => import('./ServiceFeaturedArticle')),
	block_service_credentials_cta: dynamic(() => import('./ServiceCredentialsCTA')),
	block_service_product_catalogue: dynamic(() => import('./ServiceProductCatalogue')),
	block_service_tabs: dynamic(() => import('./ServiceTabs')),
	block_services_tab: dynamic(() => import('./ServiceItems')),
	block_expertise_cards: dynamic(() => import('./ExpertiseCards')),
	block_service_platform_banner: dynamic(() => import('./PlatformBanner')),
	block_card_grid: dynamic(() => import('@/components/blocks/CardGrid')),
	block_reach_out: dynamic(() => import('@/components/blocks/ReachOut')),
	block_acknowledgement: dynamic(() => import('@/components/blocks/Acknowledgement')),
	block_culture_gallery: dynamic(() => import('@/components/blocks/CultureGallery')),
	block_values: dynamic(() => import('@/components/blocks/ValuesBlock')),
	block_people_say: dynamic(() => import('@/components/blocks/PeopleSay')),
	block_intro_media: dynamic(() => import('@/components/blocks/IntroMedia')),
	block_open_roles: dynamic(() => import('@/components/blocks/OpenRoles')),
	block_cta_split: dynamic(() => import('@/components/blocks/CtaSplit')),
};

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
}

const BaseBlock = ({ block }: BaseBlockProps) => {
	const Component = components[block.collection];

	if (!Component) {
		return null;
	}
	const itemId = block.item?.id;

	return <Component data={block.item} blockId={block.id} itemId={itemId} />;
};

export default BaseBlock;