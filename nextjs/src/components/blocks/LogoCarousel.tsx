'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface LogoCarouselItem {
	id: string;
	sort?: number | null;
	name?: string | null;
	url?: string | null;
	logo?: string | null;
}

interface LogoCarouselProps {
	data: {
		id: string;
		tagline?: string | null;
		tagline_color?: string | null;
		background_color?: string | null;
		logos?: LogoCarouselItem[];
	};
}

const MARQUEE_KEYFRAMES = `
@keyframes marquee {
	from { transform: translateX(0); }
	to   { transform: translateX(-50%); }
}
`;

export default function LogoCarousel({ data }: LogoCarouselProps) {
	const { id, tagline, tagline_color, background_color, logos } = data;

	const sortedLogos = logos ? [...logos].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const bgColor = background_color ?? '#0b2d34';

	// Duplicate for seamless loop — translateX(-50%) snaps back to start
	const loopedLogos = [...sortedLogos, ...sortedLogos];

	// ~4s per logo, minimum 16s
	const duration = `${Math.max(sortedLogos.length * 4, 16)}s`;

	return (
		<div
			className="w-full flex flex-col gap-6 md:gap-10 pb-8 md:pb-10 pt-4"
			style={{ background: bgColor }}
			data-directus={setAttr({ collection: 'block_logo_carousel', item: id, fields: ['tagline', 'logos'], mode: 'popover' })}
		>
			<style>{MARQUEE_KEYFRAMES}</style>

			{tagline && (
				<Container>
					<div className="font-sans font-normal text-[14px] md:text-[16px] leading-[26px] text-center" style={{ color: tagline_color ?? '#ffffff' }} dangerouslySetInnerHTML={{ __html: tagline }} />
				</Container>
			)}

			{sortedLogos.length > 0 && (
				<div
					className="relative w-full overflow-hidden"
					data-directus={setAttr({ collection: 'block_logo_carousel', item: id, fields: 'logos', mode: 'modal' })}
				>
					{/* Left edge fade */}
					<div
						className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-28 z-10"
						style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
					/>
					{/* Right edge fade */}
					<div
						className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-28 z-10"
						style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
					/>

					{/* Marquee track */}
					<div
						className="flex items-center gap-8 sm:gap-12 md:gap-16 w-max"
						style={{ animation: `marquee ${duration} linear infinite` }}
						onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')}
						onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')}
					>
						{loopedLogos.map((item, i) => {
							const inner = item.logo ? (
								<div className="relative h-7 w-20 sm:h-9 sm:w-28 md:h-12 md:w-[180px] shrink-0">
									<DirectusImage
										uuid={item.logo}
										alt={item.name ?? 'Partner logo'}
										fill
										sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 180px"
										className="object-contain object-center"
									/>
								</div>
							) : (
								<span className="text-white font-semibold text-sm md:text-lg whitespace-nowrap shrink-0">
									{item.name}
								</span>
							);

							const key = `${item.id}-${i}`;

							if (item.url) {
								return (
									<a
										key={key}
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center shrink-0 opacity-80 hover:opacity-100 transition-opacity"
										aria-label={item.name ?? 'Partner'}
									>
										{inner}
									</a>
								);
							}

							return (
								<div key={key} className="flex items-center shrink-0 opacity-80">
									{inner}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
