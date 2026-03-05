'use client';

import { useState } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

export interface ServiceProductItem {
	id: string;
	sort?: number | null;
	label?: string | null;
}

export interface ServiceProductCatalogueData {
	id: string;
	headline?: string | null;
	image?: string | null;
	image_alt?: string | null;
	products?: ServiceProductItem[] | null;
}

interface ServiceProductCatalogueProps {
	data: ServiceProductCatalogueData;
	accentColor?: string | null;
	/** When true, renders without outer <section> wrapper (used inside ServiceItems gray card) */
	contained?: boolean;
}

/** Darkens a hex color by reducing each channel by `amount` (0–1). */
function darkenColor(hex: string, amount = 0.41): string {
	const h = hex.replace('#', '');
	if (h.length !== 6) return hex;
	const r = Math.round(parseInt(h.slice(0, 2), 16) * (1 - amount));
	const g = Math.round(parseInt(h.slice(2, 4), 16) * (1 - amount));
	const b = Math.round(parseInt(h.slice(4, 6), 16) * (1 - amount));
	
return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function ServiceProductCatalogue({ data, accentColor, contained }: ServiceProductCatalogueProps) {
	const { id, headline,  image, image_alt, products } = data;
	const accent = accentColor || '#fab400';
	const accentDark = darkenColor(accent);

	const sorted = [...(products || [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const [activeIndex, setActiveIndex] = useState(0);

	const headlineBlock = (size: 'sm' | 'lg') => (
		headline  ? (
			<p
				className="font-sans font-medium text-[#fcfcfd]"
				style={size === 'lg'
					? { fontSize: '40px', lineHeight: '48px' }
					: { fontSize: '32px', lineHeight: '40px' }
				}
				dangerouslySetInnerHTML={{ __html: headline }}
			>		
			</p>
		) : null
	);

	const productList = (
		<div className="flex flex-col gap-[16px]">
			{sorted.map((product, index) => (
				<button
					key={product.id}
					onClick={() => setActiveIndex(index)}
					className="w-full text-left p-[16px] rounded-[8px] transition-colors"
					style={{ backgroundColor: index === activeIndex ? accentDark : '#11262b' }}
					data-directus={setAttr({
						collection: 'block_service_product_catalogue_item',
						item: product.id,
						fields: ['label'],
						mode: 'popover',
					})}
				>
					<p className="font-sans font-semibold text-[18px] leading-[25px] text-white">
						{product.label}
					</p>
				</button>
			))}
		</div>
	);

	const directusAttr = setAttr({
		collection: 'block_service_product_catalogue',
		item: id,
		fields: ['headline', 'headline_emphasis', 'image'],
		mode: 'popover',
	});

	const mobileContent = (
		<div className="lg:hidden px-4 py-10 flex flex-col gap-8">
			<div className="flex flex-col gap-6">
				{headlineBlock('sm')}
				{sorted.length > 0 && productList}
			</div>
			{image && (
				<div className="relative w-full h-[220px] rounded-[8px] overflow-hidden">
					<DirectusImage
						uuid={image}
						alt={image_alt || headline || ''}
						fill
						sizes="100vw"
						className="object-cover object-left-top"
					/>
				</div>
			)}
		</div>
	);

	const desktopContent = (
		/* Total height: 63px top padding + 483px image + 63px bottom = 609px */
		<div className="hidden lg:block relative" style={{ height: '609px' }}>
			{/* Left content */}
			<div
				className="absolute flex flex-col gap-[24px]"
				style={{ left: '66px', top: '63px', width: '471px' }}
			>
				{headlineBlock('lg')}
				{sorted.length > 0 && productList}
			</div>

			{/* Right image — bleeds to right edge */}
			{image && (
				<div
					className="absolute overflow-hidden rounded-[8px]"
					style={{ left: '633px', top: '63px', right: '0', height: '483px' }}
				>
					<DirectusImage
						uuid={image}
						alt={image_alt || headline || ''}
						fill
						sizes="(max-width: 1440px) 55vw, 780px"
						className="object-cover object-left-top"
						priority
					/>
				</div>
			)}
		</div>
	);

	if (contained) {
		return (
			<div
				className="w-full overflow-hidden rounded-[8px]"
				style={{ backgroundColor: '#071d22' }}
				data-directus={directusAttr}
			>
				{mobileContent}
				{desktopContent}
			</div>
		);
	}

	return (
		<section
			className="w-full overflow-hidden"
			style={{ backgroundColor: '#071d22' }}
			data-directus={directusAttr}
		>
			{mobileContent}
			<div className="max-w-[1440px] mx-auto">
				{desktopContent}
			</div>
		</section>
	);
}
