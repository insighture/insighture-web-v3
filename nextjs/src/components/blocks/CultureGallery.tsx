'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface CultureGalleryData {
	id: string;
	title?: string | null;
	description?: string | null;
	side_photo_left?: string | null;
	side_photo_right?: string | null;
	photo_1?: string | null;
	caption_1?: string | null;
	photo_2?: string | null;
	caption_2?: string | null;
	photo_3?: string | null;
	caption_3?: string | null;
	photo_4?: string | null;
	caption_4?: string | null;
}

const PolaroidCard = ({
	uuid,
	caption,
	tiltClass,
	size = 'large',
}: {
	uuid?: string | null;
	caption?: string | null;
	tiltClass: string;
	size?: 'small' | 'large';
}) => {
	const cardW = size === 'small' ? 'w-[204px]' : 'w-[275px]';
	const imgH = size === 'small' ? 'h-[171px]' : 'h-[230px]';
	const padB = size === 'small' ? 'pb-4' : 'pb-10';
	const shadow =
		size === 'small'
			? 'shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08)]'
			: 'shadow-[4px_4px_8px_0px_rgba(45,50,54,0.16)]';

	if (!uuid && !caption) return null;

	return (
		<div className={`${tiltClass} transition-transform hover:rotate-0 duration-300`}>
			<div className={`relative bg-[#f5f5f5] rounded-2xl ${shadow} p-4 ${padB} ${cardW}`}>
				<div className={`relative w-full ${imgH} rounded-lg overflow-hidden`}>
					{uuid ? (
						<DirectusImage
							uuid={uuid}
							alt={caption ?? ''}
							fill
							sizes={size === 'small' ? '204px' : '275px'}
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-200" />
					)}
				</div>
				{caption && (
					<p
						className="absolute bottom-2 inset-x-0 text-center text-[22px] leading-[28px] text-[#464d52]"
						style={{ fontFamily: "'Caveat', cursive" }}
					>
						{caption}
					</p>
				)}
			</div>
		</div>
	);
};

export default function CultureGallery({ data }: { data: CultureGalleryData }) {
	const {
		id,
		title,
		description,
		side_photo_left,
		side_photo_right,
		photo_1,
		caption_1,
		photo_2,
		caption_2,
		photo_3,
		caption_3,
		photo_4,
		caption_4,
	} = data;

	const bottomCards = [
		{ uuid: photo_1, caption: caption_1, tilt: 'rotate-[8deg]' },
		{ uuid: photo_2, caption: caption_2, tilt: '-rotate-[8deg]' },
		{ uuid: photo_3, caption: caption_3, tilt: 'rotate-[8deg]' },
		{ uuid: photo_4, caption: caption_4, tilt: '-rotate-[8deg]' },
	];

	return (
		<div className="relative w-full bg-white overflow-hidden py-20 lg:py-[120px]">
			{/* Decorative dashed arc */}
			<div
				className="pointer-events-none absolute inset-x-0 top-[45%] hidden lg:block"
				aria-hidden="true"
			>
				<svg
					viewBox="0 0 1440 300"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full"
					preserveAspectRatio="none"
				>
					<path
						d="M 0 260 C 180 180, 360 240, 720 180 C 1080 120, 1260 200, 1440 140"
						stroke="#c0cdd5"
						strokeWidth="2"
						strokeDasharray="8 6"
						fill="none"
					/>
				</svg>
			</div>

			<div className="relative z-10 flex flex-col items-center gap-16 lg:gap-[68px] px-6 lg:px-10">
				{/* Header section with side photos */}
				<div className="relative w-full flex items-center justify-center min-h-[200px]">
					{/* Side photos - absolutely positioned at top-left and top-right */}
					<div className="absolute inset-x-0 top-0 hidden lg:flex items-start justify-between pointer-events-none">
						<div className="pointer-events-auto">
							<PolaroidCard uuid={side_photo_left} tiltClass="-rotate-[8deg]" size="small" />
						</div>
						<div className="pointer-events-auto">
							<PolaroidCard uuid={side_photo_right} tiltClass="rotate-[8deg]" size="small" />
						</div>
					</div>

					{/* Center heading + description */}
					<div
						className="flex flex-col items-center gap-[40px] text-center w-full max-w-[800px] py-2.5"
						data-directus={setAttr({
							collection: 'block_culture_gallery',
							item: id,
							fields: ['title', 'description'],
							mode: 'popover',
						})}
					>
						{title && (
							<h2
								className="font-heading font-medium text-[40px] lg:text-[48px] leading-[1.1] text-[#2d3236] w-full"
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						)}
						{description && (
							<p className="font-sans font-normal text-[18px] lg:text-[24px] leading-[1.67] text-[#2d3236] w-full">
								{description}
							</p>
						)}
					</div>
				</div>

				{/* Bottom Polaroid cards */}
				<div className="flex flex-wrap justify-center gap-4 lg:gap-[15px]">
					{bottomCards.map((card, i) => (
						<PolaroidCard key={i} uuid={card.uuid} caption={card.caption} tiltClass={card.tilt} />
					))}
				</div>
			</div>
		</div>
	);
}
