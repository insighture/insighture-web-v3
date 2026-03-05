import { PageBlock } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/container';

interface PageBuilderProps {
	sections: PageBlock[];
}

const PageBuilder = ({ sections }: PageBuilderProps) => {
	const validBlocks = sections.filter(
		(block): block is PageBlock & { collection: string; item: object } =>
			typeof block.collection === 'string' && !!block.item && typeof block.item === 'object',
	);

	return (
		<div>
			{validBlocks.map((block) => {
				const isFullBleed =
					block.collection === 'block_hero' &&
					typeof block.item === 'object' &&
					block.item !== null &&
					'layout' in block.item &&
					(block.item as { layout?: string }).layout === 'image_expanded';

				const sectionBg =
					(block.collection === 'block_richtext' || block.collection === 'block_services' ||
					block.collection === 'block_testimonials' || block.collection === 'block_logo_carousel' ||
					block.collection === 'block_credentials') &&
					typeof block.item === 'object' &&
					block.item !== null &&
					'background_color' in block.item
						? (block.item as { background_color?: string | null }).background_color
						: null;

							const isReachOut = block.collection === 'block_reach_out';

				const isFullBleedBlock =
					block.collection === 'block_testimonials' ||
					block.collection === 'block_logo_carousel' ||
					block.collection === 'block_feature_split' ||
					block.collection === 'block_insights' ||
					block.collection === 'block_credentials' ||
					block.collection === 'block_culture_gallery' ||
					block.collection === 'block_reach_out' ||
					block.collection === 'block_values';

				if (isFullBleed || sectionBg || isFullBleedBlock) {
					return (
						<div
							key={block.id}
							data-background={block.background}
							style={sectionBg ? { backgroundColor: sectionBg } : isReachOut ? { backgroundColor: '#ffffff' } : undefined}
						>
							<BaseBlock
								block={{
									collection: block.collection,
									item: block.item,
									id: block.id,
								}}
							/>
						</div>
					);
				}

				return (
					<div key={block.id} data-background={block.background} className="py-16">
						<Container>
							<BaseBlock
								block={{
									collection: block.collection,
									item: block.item,
									id: block.id,
								}}
							/>
						</Container>
					</div>
				);
			})}
		</div>
	);
};

export default PageBuilder;
