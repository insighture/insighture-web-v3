'use client';

import { useId } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface CardGridItem {
	id: string;
	sort?: number | null;
	variant?: 'feature' | 'testimonial' | null;
	image?: string | null;
	title?: string | null;
	description?: string | null;
	quote?: string | null;
	author_name?: string | null;
	author_role?: string | null;
	accent_color?: string | null;
}

interface CardGridProps {
	data: {
		id: string;
		tagline?: string | null;
		headline?: string | null;
		description?: string | null;
		columns?: number | null;
		background_color?: string | null;
		items?: CardGridItem[];
	};
}

const CardGrid = ({ data }: CardGridProps) => {
	const { id, tagline, headline, description, columns, background_color, items } = data;
	const scopeId = useId().replace(/:/g, '');

	const sortedItems = items ? [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const cols = Math.max(1, Math.min(4, columns ?? 4)); // Clamp between 1-4

	// Determine grid classes based on column count
	const gridClasses = {
		1: 'grid-cols-1',
		2: 'lg:grid-cols-2 grid-cols-1',
		3: 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1',
		4: 'lg:grid-cols-4 md:grid-cols-2 grid-cols-1',
	}[cols] || 'lg:grid-cols-4 md:grid-cols-2 grid-cols-1';

	return (
		<div
			id={`card-grid-${scopeId}`}
			className="w-full px-6 md:px-16 lg:px-[120px] py-20"
			style={{ background: background_color ?? 'transparent' }}
		>
			{/* Section header */}
			{(tagline || headline || description) && (
				<div className="flex flex-col gap-6 items-center text-center mb-10 lg:mb-16 max-w-[1190px] mx-auto">
					{tagline && (
						<div
							className="text-sm font-semibold uppercase tracking-widest text-primary"
							dangerouslySetInnerHTML={{ __html: tagline }}
							data-directus={setAttr({ collection: 'block_card_grid', item: id, fields: 'tagline', mode: 'popover' })}
						/>
					)}
					{headline && (
						<div
							className="font-heading font-normal text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] text-[#1d2939]"
							dangerouslySetInnerHTML={{ __html: headline }}
							data-directus={setAttr({ collection: 'block_card_grid', item: id, fields: 'headline', mode: 'popover' })}
						/>
					)}
					{description && (
						<div
							className="text-[16px] leading-[24px] md:text-[18px] md:leading-[26px] text-[#1d2939] max-w-[800px]"
							dangerouslySetInnerHTML={{ __html: description }}
							data-directus={setAttr({ collection: 'block_card_grid', item: id, fields: 'description', mode: 'popover' })}
						/>
					)}
				</div>
			)}

			{/* Card grid */}
			{sortedItems.length > 0 && (
				<div
					className={`grid ${gridClasses} gap-6 max-w-[1190px] mx-auto`}
					data-directus={setAttr({ collection: 'block_card_grid', item: id, fields: 'items', mode: 'modal' })}
				>
					{sortedItems.map((item) => (
						<CardItem key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
};

function CardItem({ item }: { item: CardGridItem }) {
	const variant = item.variant ?? 'feature';

	if (variant === 'testimonial') {
		return <TestimonialCard item={item} />;
	}

	return <FeatureCard item={item} />;
}

function FeatureCard({ item }: { item: CardGridItem }) {
	return (
		<div className="border-2 border-[#d0d5dd] rounded-[8px] px-6 py-4 flex flex-col gap-6">
			{/* Icon */}
			{item.image && (
				<div className="relative size-12 shrink-0">
					<DirectusImage
						uuid={item.image}
						alt={item.title ?? 'Feature icon'}
						fill
						sizes="48px"
						className="object-contain"
					/>
				</div>
			)}

			{/* Content */}
			<div className="flex flex-col gap-4">
				{item.title && (
					<div
						className="font-heading font-medium text-[24px] leading-[32px] text-[#15181a]"
						dangerouslySetInnerHTML={{ __html: item.title }}
					/>
				)}
				{item.description && (
					<div
						className="font-sans font-normal text-[16px] leading-[24px] text-[#15181a]"
						dangerouslySetInnerHTML={{ __html: item.description }}
					/>
				)}
			</div>
		</div>
	);
}

function TestimonialCard({ item }: { item: CardGridItem }) {
	return (
		<div className="flex flex-col gap-6">
			{/* Logo */}
			{item.image && (
				<div className="relative h-14 md:h-16 w-full">
					<DirectusImage
						uuid={item.image}
						alt={item.author_name ?? 'Company logo'}
						fill
						sizes="(max-width: 768px) 190px, 197px"
						className="object-contain object-left"
					/>
				</div>
			)}

			{/* Quote */}
			{item.quote && (
				<div
					className="font-sans font-normal italic text-[15px] leading-[22px] md:text-[16px] md:leading-[24px] text-[#15181a]"
					dangerouslySetInnerHTML={{ __html: item.quote }}
				/>
			)}

			{/* Attribution */}
			{(item.author_name || item.author_role) && (
				<div className="flex flex-col gap-1">
					{item.author_name && (
						<p className="font-sans font-semibold text-[16px] leading-[20px] text-primary">
							{item.author_name}
						</p>
					)}
					{item.author_role && (
						<p className="font-sans font-normal text-[14px] leading-[20px] text-[#667085]">
							{item.author_role}
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default CardGrid;
