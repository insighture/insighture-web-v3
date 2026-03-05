'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface ValuesItem {
	id: number | string;
	sort?: number | null;
	icon?: string | null;
	title?: string | null;
	description?: string | null;
}

interface ValuesBlockData {
	id: number | string;
	heading?: string | null;
	center_image?: string | null;
	value_items?: ValuesItem[];
}

export default function ValuesBlock({ data }: { data: ValuesBlockData }) {
	const { id, heading, center_image, value_items } = data;

	const sorted = value_items ? [...value_items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const leftCards = sorted.slice(0, 2);
	const rightCards = sorted.slice(2, 4);

	return (
		<div className="bg-[#0b2d34] w-full px-8 lg:px-[120px] py-[80px]">
			{heading && (
				<div
					className="mb-16 text-center text-[#fcfcfd] font-heading text-[40px] lg:text-[48px] leading-[56px] font-normal"
					data-directus={setAttr({ collection: 'block_values', item: id, fields: 'heading', mode: 'popover' })}
					dangerouslySetInnerHTML={{ __html: heading }}
				/>
			)}

			<div className="flex gap-16 items-center">
				{/* Left cards */}
				<div
					className="flex flex-col gap-16 flex-1"
					data-directus={setAttr({ collection: 'block_values', item: id, fields: 'value_items', mode: 'popover' })}
				>
					{leftCards.map((item) => (
						<ValueCard key={item.id} item={item} />
					))}
				</div>

				{/* Center image */}
				<div
					className="relative hidden lg:block shrink-0 w-[400px] h-[640px] rounded-2xl overflow-hidden shadow-[2px_2px_10px_0px_rgba(7,29,34,0.2)]"
					data-directus={setAttr({ collection: 'block_values', item: id, fields: 'center_image', mode: 'popover' })}
				>
					{center_image ? (
						<DirectusImage
							uuid={center_image}
							alt="Team photo"
							fill
							sizes="400px"
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-[#0f3b43]" />
					)}
				</div>

				{/* Right cards */}
				<div className="flex flex-col gap-16 flex-1">
					{rightCards.map((item) => (
						<ValueCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</div>
	);
}

function ValueCard({ item }: { item: ValuesItem }) {
	return (
		<div className="bg-[#0f3b43] flex flex-col gap-[60px] p-6 rounded-2xl shadow-[2px_2px_10px_0px_rgba(7,29,34,0.2)]">
			{item.icon && (
				<div className="relative w-16 h-16 shrink-0">
					<DirectusImage
						uuid={item.icon}
						alt={item.title ?? ''}
						fill
						sizes="64px"
						className="object-contain"
					/>
				</div>
			)}
			<div className="flex flex-col gap-4 text-[#fcfcfd]">
				{item.title && (
					<p className="font-heading font-medium text-[22px] leading-[26px]">{item.title}</p>
				)}
				{item.description && (
					<p className="font-sans font-normal text-[16px] leading-[24px]">{item.description}</p>
				)}
			</div>
		</div>
	);
}
