'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface FeatureSplitItem {
	id: string;
	sort?: number | null;
	is_highlighted?: boolean | null;
	title?: string | null;
	description?: string | null;
	link_label?: string | null;
	url?: string | null;
}

interface FeatureSplitProps {
	data: {
		id: string;
		headline?: string | null;
		headline_emphasis?: string | null;
		description?: string | null;
		image?: string | null;
		items?: FeatureSplitItem[];
	};
}

export default function FeatureSplit({ data }: FeatureSplitProps) {
	const { id, headline, headline_emphasis, description, image, items } = data;

	const sortedItems = items ? [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];

	return (
		<div className="w-full bg-white">
			<Container className="py-[48px] lg:py-[80px] lg:px-[120px] flex flex-col gap-[32px] lg:gap-[40px]">

				{/* Heading block */}
				<div
					className="flex flex-col gap-[24px] lg:gap-[40px]"
					data-directus={setAttr({ collection: 'block_feature_split', item: id, fields: ['headline', 'headline_emphasis', 'description'], mode: 'popover' })}
				>
					<h2 className="font-heading font-semibold text-[32px] leading-[38px] md:text-[40px] md:leading-[44px] lg:text-[48px] lg:leading-[40px] text-[#1d2939] max-w-[509px]">
						<span dangerouslySetInnerHTML={{ __html: headline }} />
						{headline_emphasis && (
							<span className="italic text-[#ee4065]" dangerouslySetInnerHTML={{ __html: headline_emphasis }} />
						)}
					</h2>
					{description && (
						<div className="font-sans font-normal text-[16px] leading-[26px] lg:text-[22px] lg:leading-[30px] text-[#1d2939] max-w-[509px]" dangerouslySetInnerHTML={{ __html: description }} />
					)}
				</div>

				{/* Content row — stacks on mobile, side-by-side on desktop */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

					{/* Items with accent line */}
					{sortedItems.length > 0 && (
						<div
							className="flex gap-[24px] items-start"
							data-directus={setAttr({ collection: 'block_feature_split', item: id, fields: 'items', mode: 'modal' })}
						>
							{/* Vertical accent line — one segment per item */}
							<div className="flex flex-col self-stretch shrink-0" aria-hidden="true">
								{sortedItems.map((item, i) => (
									<div
										key={item.id}
										className="w-[2px] flex-1"
										style={{
											background: item.is_highlighted ? '#ee4065' : '#d0d5dd',
											minHeight: i < sortedItems.length - 1 ? '0' : undefined,
										}}
									/>
								))}
							</div>

							{/* Items list */}
							<div className="flex flex-col gap-[32px] lg:gap-[48px] min-w-0 lg:w-[493px] lg:flex-none">
								{sortedItems.map((item) => (
									<div key={item.id} className="flex flex-col gap-[12px] lg:gap-[16px]">
										{item.title && (
											<div
												className="font-heading font-semibold text-[20px] leading-[24px] lg:text-[26px] lg:leading-[26px]"
												style={{ color: item.is_highlighted ? '#ee4065' : '#1d2939' }}
												dangerouslySetInnerHTML={{ __html: item.title }}
											/>
										)}
										{item.description && (
											<div className="font-sans font-normal text-[15px] leading-[24px] lg:text-[18px] lg:leading-[26px] text-[#1d2939]" dangerouslySetInnerHTML={{ __html: item.description }} />
										)}
										{item.link_label && (
											<a
												href={item.url ?? '#'}
												className="inline-flex items-center gap-[8px] self-start px-[16px] py-[8px] rounded-[36px] border border-[#475467] text-[#344054] font-heading font-semibold text-[14px] leading-[22px] lg:text-[16px] lg:leading-[26px] hover:bg-[#f9fafb] transition-colors"
											>
												{item.link_label}
												<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
													<path d="M7.5 5L12.5 10L7.5 15" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											</a>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Image — full-width with aspect ratio on mobile, fixed on desktop */}
					{image && (
						<div
							className="relative w-full rounded-[16px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:shrink-0 lg:w-[619px] lg:self-stretch lg:min-h-[400px]"
							data-directus={setAttr({ collection: 'block_feature_split', item: id, fields: 'image', mode: 'popover' })}
						>
							<DirectusImage
								uuid={image}
								alt={headline ?? ''}
								fill
								sizes="(max-width: 1024px) 100vw, 619px"
								className="object-cover"
							/>
						</div>
					)}
				</div>
			</Container>
		</div>
	);
}
