'use client';

import RichText from '@/components/blocks/RichText';
import Hero from '@/components/blocks/Hero';
import Gallery from '@/components/blocks/Gallery';
import Pricing from '@/components/blocks/Pricing';
import Posts from '@/components/blocks/Posts';
import Form from '@/components/blocks/Form';
import Services from '@/components/blocks/Services';
import Testimonials from '@/components/blocks/Testimonials';
import LogoCarousel from '@/components/blocks/LogoCarousel';
import FeatureSplit from '@/components/blocks/FeatureSplit';
import Insights from '@/components/blocks/Insights';
import Credentials from '@/components/blocks/Credentials';
import BlogFeaturedPost from '@/components/blocks/BlogFeaturedPost';
import PostsCarousel from './PostsCarousel';
import AllPostsGrid from './AllPostsGrid';
import ServiceFeaturedArticle from './ServiceFeaturedArticle';
import ServiceCredentialsCTA from './ServiceCredentialsCTA';
import ServiceProductCatalogue from './ServiceProductCatalogue';
import ServiceTabs from './ServiceTabs';
import ServiceItems from './ServiceItems';
import ExpertiseCards from './ExpertiseCards';
import PlatformBanner from './PlatformBanner';
import CardGrid from '@/components/blocks/CardGrid';
import ReachOut from '@/components/blocks/ReachOut';
import Acknowledgement from '@/components/blocks/Acknowledgement';
import CultureGallery from '@/components/blocks/CultureGallery';
import ValuesBlock from '@/components/blocks/ValuesBlock';
import PeopleSay from '@/components/blocks/PeopleSay';
import IntroMedia from '@/components/blocks/IntroMedia';
import OpenRoles from '@/components/blocks/OpenRoles';
import CtaSplit from '@/components/blocks/CtaSplit';

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
}

const BaseBlock = ({ block }: BaseBlockProps) => {
	const components: Record<string, React.ElementType> = {
		block_hero: Hero,
		block_richtext: RichText,
		block_gallery: Gallery,
		block_pricing: Pricing,
		block_posts: Posts,
		block_form: Form,
		block_services: Services,
		block_testimonials: Testimonials,
		block_logo_carousel: LogoCarousel,
		block_feature_split: FeatureSplit,
		block_insights: Insights,
		block_credentials: Credentials,
		block_featured_post: BlogFeaturedPost,
		block_posts_carousel: PostsCarousel,
		block_all_posts: AllPostsGrid,
		block_service_featured_article: ServiceFeaturedArticle,
		block_service_credentials_cta: ServiceCredentialsCTA,
		block_service_product_catalogue: ServiceProductCatalogue,
		block_service_tabs: ServiceTabs,
		block_services_tab: ServiceItems,
		block_expertise_cards: ExpertiseCards,
		block_service_platform_banner: PlatformBanner,
		block_card_grid: CardGrid,
		block_reach_out: ReachOut,
		block_acknowledgement: Acknowledgement,
		block_culture_gallery: CultureGallery,
		block_values: ValuesBlock,
		block_people_say: PeopleSay,
		block_intro_media: IntroMedia,
		block_open_roles: OpenRoles,
		block_cta_split: CtaSplit,
	};

	const Component = components[block.collection];

	if (!Component) {
		return null;
	}
	const itemId = block.item?.id;

	return <Component data={block.item} blockId={block.id} itemId={itemId} />;
};

export default BaseBlock;