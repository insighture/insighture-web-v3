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

const PIN_COLORS = {
	red: '#D94040',
	green: '#4CAF72',
	blue: '#4A90D9',
	yellow: '#E6AC2A',
};

const PinIcon = ({ color, size = 'large' }: { color: string; size?: 'small' | 'large' }) => {
	const w = size === 'small' ? 14 : 18;
	const h = size === 'small' ? 22 : 28;
	const cx = w / 2;
	const headR = size === 'small' ? 5.5 : 7;
	const stemY1 = headR * 2 + 1;
	
	return (
		<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx={cx} cy={headR} r={headR} fill={color} />
			<ellipse cx={cx - headR * 0.3} cy={headR * 0.55} rx={headR * 0.4} ry={headR * 0.3} fill="white" fillOpacity="0.35" />
			<line x1={cx} y1={stemY1} x2={cx} y2={h} stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
};

const PolaroidCard = ({
	uuid,
	caption,
	tiltClass,
	size = 'large',
	pinColor = PIN_COLORS.red,
}: {
	uuid?: string | null;
	caption?: string | null;
	tiltClass: string;
	size?: 'small' | 'large';
	pinColor?: string;
}) => {
	if (!uuid && !caption) return null;

	const cardW = size === 'small' ? 'w-[204px]' : 'w-[275px]';
	const imgH = size === 'small' ? 'h-[171px]' : 'h-[230px]';
	const padB = size === 'small' ? 'pb-4' : 'pb-10';
	const shadow =
		size === 'small'
			? 'shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08)]'
			: 'shadow-[4px_4px_8px_0px_rgba(45,50,54,0.16)]';

	return (
		<div className={`${tiltClass} transition-transform hover:rotate-0 duration-300 relative`}>
			{/* Push pin centered above card */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[55%] z-20 drop-shadow">
				<PinIcon color={pinColor} size={size} />
			</div>
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
						<div className="size-full bg-gray-200" />
					)}
				</div>
				{caption && (
					<p
						className="absolute bottom-2 inset-x-0 text-center leading-[28px] text-[#464d52]"
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
		{ uuid: photo_1, caption: caption_1, tilt: 'rotate-[8deg]', pinColor: PIN_COLORS.red },
		{ uuid: photo_2, caption: caption_2, tilt: '-rotate-[8deg]', pinColor: PIN_COLORS.blue },
		{ uuid: photo_3, caption: caption_3, tilt: 'rotate-[8deg]', pinColor: PIN_COLORS.yellow },
		{ uuid: photo_4, caption: caption_4, tilt: '-rotate-[8deg]', pinColor: PIN_COLORS.green },
	];

	return (
		<div className="relative w-full bg-white overflow-hidden py-20 lg:py-[120px]">
			{/* Decorative dotlines image — matches Figma positioning */}
			{/* Figma: left=34.57px, top=163.48px, width=1370.853px out of 1440px section */}
			<img
				src="/images/dotlines.png"
				alt=""
				aria-hidden="true"
				className="pointer-events-none absolute hidden lg:block h-auto"
				style={{ left: '2.4%', top: '163px', width: '95.2%' }}
			/>

			<div className="relative z-10 flex flex-col items-center gap-16 lg:gap-[68px] px-6 lg:px-10">
				{/* Header section with side photos */}
				<div className="relative w-full flex items-center justify-center min-h-[200px]">
					{/* Side photos - absolutely positioned at top-left and top-right */}
					<div className="absolute inset-x-0 top-0 hidden lg:flex items-start justify-between pointer-events-none">
						<div className="pointer-events-auto">
							<PolaroidCard uuid={side_photo_left} tiltClass="-rotate-[8deg]" size="small" pinColor={PIN_COLORS.red} />
						</div>
						<div className="pointer-events-auto">
							<PolaroidCard uuid={side_photo_right} tiltClass="rotate-[8deg]" size="small" pinColor={PIN_COLORS.red} />
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
				<div className="flex flex-nowrap justify-center gap-6 lg:gap-8 pb-4">
					{bottomCards.map((card, i) => (
						<PolaroidCard
							key={i}
							uuid={card.uuid}
							caption={card.caption}
							tiltClass={card.tilt}
							pinColor={card.pinColor}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
