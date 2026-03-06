'use client';

import { useState, useCallback, useRef } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface TestimonialsStat {
	id: string;
	sort?: number | null;
	value?: string | null;
	label?: string | null;
}

interface TestimonialsItem {
	id: string;
	sort?: number | null;
	quote?: string | null;
	image?: string | null;
	video?: string | null;
	author_name?: string | null;
	author_role?: string | null;
	author_avatar?: string | null;
	background_color?: string | null;
	font_color?: string | null;
}

interface TestimonialsProps {
	data: {
		id: string;
		headline?: string | null;
		headline_emphasis?: string | null;
		background_color?: string | null;
		stats?: TestimonialsStat[];
		testimonials?: TestimonialsItem[];
	};
}

const KEYFRAMES = `
@keyframes cardFlyToFront {
  from { transform: translate(-12px, 8px) rotate(-5deg) scale(0.95); opacity: 0.6; }
  to   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
}
@keyframes cardFlyToFrontReverse {
  from { transform: translate(12px, 8px) rotate(5deg) scale(0.95); opacity: 0.6; }
  to   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
}
@keyframes ghostFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

function TestimonialCard({
	item,
	onPrev,
	onNext,
	showNav = false,
}: {
	item: TestimonialsItem;
	onPrev?: () => void;
	onNext?: () => void;
	showNav?: boolean;
}) {
	const fc = item.font_color ?? '#ffffff';

	return (
		<div
			className="flex flex-col gap-4 md:gap-6 rounded-[16px] p-4 md:p-6 w-full"
			style={{ background: item.background_color ?? '#c72d4f' }}
		>
			{/* Top row: quotation mark + image */}
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
				<div className="shrink-0 flex items-start">
					<svg
						viewBox="0 0 108 84"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-10 h-[31px] md:w-[72px] md:h-[56px] lg:w-[108px] lg:h-[84px]"
					>
						<path
							d="M0 84V51.333C0 22.444 14.444 7.111 43.333 0L49.333 10.667C36.444 14.222 28.222 20.444 24.667 29.333C22.889 33.778 22.222 38.667 22.667 44H44V84H0ZM64 84V51.333C64 22.444 78.444 7.111 107.333 0L113.333 10.667C100.444 14.222 92.222 20.444 88.667 29.333C86.889 33.778 86.222 38.667 86.667 44H108V84H64Z"
							fill={fc}
							fillOpacity="0.3"
						/>
					</svg>
				</div>
		{(item.video || item.image) && (
			<div className="relative rounded-[8px] overflow-hidden w-full aspect-video lg:w-[478px] lg:h-[266px] lg:aspect-auto shrink-0">
				{item.video ? (
					<video
						src={getDirectusAssetURL(item.video)}
						poster={item.image ? getDirectusAssetURL(item.image) : undefined}
						autoPlay
						muted
						loop
						playsInline
						controls
						className="size-full object-cover"
					/>
				) : item.image ? (
					<DirectusImage
						uuid={item.image}
						alt={item.author_name ?? 'Testimonial'}
						fill
						sizes="(max-width: 1024px) 100vw, 478px"
						className="object-cover"
					/>
				) : null}
			</div>
		)}
			</div>

			{/* Quote + author */}
			<div className="flex flex-col gap-4 md:gap-5">
				<div className="font-sans font-normal text-[15px] md:text-[18px] leading-[22px] md:leading-[24px]" style={{ color: fc }} dangerouslySetInnerHTML={{ __html: item.quote ?? '' }} />

				<div className="w-full border-t" style={{ borderColor: fc, opacity: 0.3 }} />

				<div className="flex items-end justify-between gap-2">
					<div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
						{item.author_avatar && (
							<div className="relative rounded-full overflow-hidden shrink-0 size-[48px] md:size-[64px]">
								<DirectusImage
									uuid={item.author_avatar}
									alt={item.author_name ?? ''}
									fill
									sizes="64px"
									className="object-cover"
								/>
							</div>
						)}
						<div className="flex flex-col gap-1 md:gap-2 min-w-0">
							<p className="font-sans font-normal text-[16px] md:text-[20px] leading-[20px] truncate" style={{ color: fc }}>
								{item.author_name}
							</p>
							<p className="font-sans font-light italic text-[13px] md:text-[16px] leading-[16px] truncate" style={{ color: fc, opacity: 0.8 }}>
								{item.author_role}
							</p>
						</div>
					</div>

					{showNav && onPrev && onNext && (
						<div className="flex gap-2 items-center shrink-0">
							<button
								onClick={onPrev}
								aria-label="Previous testimonial"
								className="size-8 rounded-full border flex items-center justify-center hover:bg-white/10 transition-colors"
								style={{ borderColor: `${fc}80` }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M10 12L6 8L10 4" stroke={fc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
							<button
								onClick={onNext}
								aria-label="Next testimonial"
								className="size-8 rounded-full border flex items-center justify-center hover:bg-white/10 transition-colors"
								style={{ borderColor: `${fc}80` }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M6 4L10 8L6 12" stroke={fc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Testimonials({ data }: TestimonialsProps) {
	const { id, headline, headline_emphasis, background_color, stats, testimonials } = data;

	const sortedStats = stats ? [...stats].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const sortedTestimonials = testimonials ? [...testimonials].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];

	const [current, setCurrent] = useState(0);
	const directionRef = useRef<'next' | 'prev'>('next');

	const prev = useCallback(() => {
		directionRef.current = 'prev';
		setCurrent((c) => (c - 1 + sortedTestimonials.length) % sortedTestimonials.length);
	}, [sortedTestimonials.length]);

	const next = useCallback(() => {
		directionRef.current = 'next';
		setCurrent((c) => (c + 1) % sortedTestimonials.length);
	}, [sortedTestimonials.length]);

	const n = sortedTestimonials.length;
	const activeItem = sortedTestimonials[current] ?? null;
	const next1 = n > 1 ? sortedTestimonials[(current + 1) % n] : null;
	const next2 = n > 2 ? sortedTestimonials[(current + 2) % n] : null;
	const bgColor = background_color ?? '#0b2d34';

	const activeEnterAnim = directionRef.current === 'next'
		? 'cardFlyToFront 0.45s cubic-bezier(0.22, 1, 0.36, 1) both'
		: 'cardFlyToFrontReverse 0.45s cubic-bezier(0.22, 1, 0.36, 1) both';

	return (
		<section
			className="relative w-full overflow-hidden"
			style={{ background: bgColor }}
			data-directus={setAttr({ collection: 'block_testimonials', item: id, fields: ['headline', 'headline_emphasis'], mode: 'popover' })}
		>
			<style>{KEYFRAMES}</style>

			<Container className="relative z-10 sm:px-8 lg:px-[80px] py-10 md:py-16 lg:py-[83px]">
				{/* Heading */}
				<h2 className="font-heading font-semibold text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px] lg:text-[48px] lg:leading-[56px] text-white mb-8 md:mb-12 lg:mb-16">
					{headline && <span dangerouslySetInnerHTML={{ __html: headline }} />}<br />
					{headline_emphasis && (
						<span className="italic text-[#ee4065]" dangerouslySetInnerHTML={{ __html: headline_emphasis }} />
					)}
				</h2>

				{/* Stats + Testimonial card row */}
				<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-8">

					{/* Stats — horizontal row on mobile, vertical column on desktop */}
					{sortedStats.length > 0 && (
						<div
							className="flex flex-row flex-wrap gap-6 lg:flex-col lg:gap-[55px] lg:shrink-0 lg:w-[199px]"
							data-directus={setAttr({ collection: 'block_testimonials', item: id, fields: 'stats', mode: 'modal' })}
						>
							{sortedStats.map((stat) => (
								<div key={stat.id} className="flex flex-col gap-1 lg:gap-[21px]">
									<p className="font-heading font-semibold text-[40px] leading-[1] lg:text-[64px] lg:leading-[56px] text-[#ee4065]">
										{stat.value}
									</p>
									<p className="font-sans font-medium text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px] text-white">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					)}

					{/* Stacked testimonial cards */}
					{activeItem && (
						<div
							className="relative w-full lg:shrink-0 lg:w-[806px] lg:h-[500px]"
							data-directus={setAttr({ collection: 'block_testimonials', item: id, fields: 'testimonials', mode: 'modal' })}
						>
							{/* Ghost cards — desktop only (require fixed-height absolute container) */}
							{next2 && (
								<div
									key={next2.id}
									className="hidden lg:block absolute inset-0 pointer-events-none"
									style={{
										transform: 'translate(-24px, 16px) rotate(-10deg)',
										transformOrigin: 'bottom center',
										zIndex: 1,
										animation: 'ghostFadeIn 0.3s ease-out both',
									}}
								>
									<TestimonialCard item={next2} />
								</div>
							)}

							{next1 && (
								<div
									key={next1.id}
									className="hidden lg:block absolute inset-0 pointer-events-none"
									style={{
										transform: 'translate(-12px, 8px) rotate(-5deg)',
										transformOrigin: 'bottom center',
										zIndex: 2,
										animation: 'ghostFadeIn 0.35s ease-out both',
									}}
								>
									<TestimonialCard item={next1} />
								</div>
							)}

							{/* Active card — relative on mobile, absolute on desktop */}
							<div
								key={activeItem.id}
								className="relative lg:absolute lg:inset-0"
								style={{ zIndex: 3, animation: activeEnterAnim }}
							>
								<TestimonialCard
									item={activeItem}
									showNav={n > 1}
									onPrev={prev}
									onNext={next}
								/>
							</div>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}
