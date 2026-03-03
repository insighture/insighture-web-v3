'use client';

import { useId } from 'react';
import ServiceCard from '@/components/blocks/ServiceCard';
import { setAttr } from '@directus/visual-editing';

interface ServicesItem {
	id: string;
	sort?: number | null;
	title?: string | null;
	description?: string | null;
	accent_color?: string | null;
	link_label?: string | null;
	url?: string | null;
}

interface ServicesProps {
	data: {
		id: string;
		tagline?: string | null;
		headline?: string | null;
		description?: string | null;
		background_color?: string | null;
		items?: ServicesItem[];
	};
}

const Services = ({ data }: ServicesProps) => {
	const { id, tagline, headline, description, items } = data;
	const scopeId = useId().replace(/:/g, '');

	const sortedItems = items ? [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];

	return (
		<div id={`svc-${scopeId}`} className="w-full px-6 md:px-16 lg:px-[123px] py-20">
			{/* Scoped style for emphasis color in headline */}
			<style>{`#svc-${scopeId} .svc-headline em { font-style: italic; }`}</style>

			{/* Section header */}
			<div className="flex flex-col gap-6 items-center text-center mb-10 max-w-[1190px] mx-auto">
				{tagline && (
					<p
						className="text-sm font-semibold uppercase tracking-widest text-primary"
						data-directus={setAttr({ collection: 'block_services', item: id, fields: 'tagline', mode: 'popover' })}
					>
						{tagline}
					</p>
				)}
				{headline && (
					<div
						className="svc-headline font-heading font-normal text-[48px] leading-[56px] text-[#1d2939]"
						dangerouslySetInnerHTML={{ __html: headline }}
						data-directus={setAttr({ collection: 'block_services', item: id, fields: 'headline', mode: 'popover' })}
					/>
				)}
				{description && (
					<p
						className="text-[18px] leading-[26px] text-[#1d2939] max-w-[800px]"
						data-directus={setAttr({ collection: 'block_services', item: id, fields: 'description', mode: 'popover' })}
					>
						{description}
					</p>
				)}
			</div>

			{/* Card grid */}
			{sortedItems.length > 0 && (
				<div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1190px] mx-auto"
					data-directus={setAttr({ collection: 'block_services', item: id, fields: 'items', mode: 'modal' })}
				>
					{sortedItems.map((item) => (
						<ServiceCard key={item.id} card={item} />
					))}
				</div>
			)}
		</div>
	);
};

export default Services;
