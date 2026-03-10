'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface LogoCarouselItem {
	id: string;
	sort?: number | null;
	name?: string | null;
	url?: string | null;
	logo?: string | null;
	subtitle?: string | null;
}

interface LogoCarouselProps {
	data: {
		id: string;
		tagline?: string | null;
		tagline_color?: string | null;
		background_color?: string | null;
		logos?: LogoCarouselItem[];
		variant?: 'auto' | 'manual' | null;
		cards_per_view?: number | null;
		show_navigation?: boolean | null;
	};
}

const MARQUEE_STYLES = `
.marquee-item {
	margin-right: 2rem;
}
@media (min-width: 640px) {
	.marquee-item { margin-right: 3rem; }
}
@media (min-width: 768px) {
	.marquee-item { margin-right: 4rem; }
}
`;

export default function LogoCarousel({ data }: LogoCarouselProps) {
	const { id, tagline, tagline_color, background_color, logos, variant = 'auto', cards_per_view = 3, show_navigation = true } = data;

	const sortedLogos = logos ? [...logos].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const bgColor = background_color ?? '#0b2d34';

	// State for manual variant pagination
	const [currentIndex, setCurrentIndex] = useState(0);
	const [responsiveCardsVisible, setResponsiveCardsVisible] = useState(1);

	// Measure the width of one set of logos to calculate exact pixel offset
	const trackRef = useRef<HTMLDivElement>(null);
	const [setWidth, setSetWidth] = useState(0);

	const measureSetWidth = useCallback(() => {
		if (!trackRef.current || sortedLogos.length === 0) return;
		const children = Array.from(trackRef.current.children) as HTMLElement[];
		// Measure the first N items (one complete set)
		let width = 0;
		for (let i = 0; i < sortedLogos.length && i < children.length; i++) {
			width += children[i].offsetWidth + parseFloat(getComputedStyle(children[i]).marginRight || '0');
		}
		setSetWidth(width);
	}, [sortedLogos.length]);

	useEffect(() => {
		measureSetWidth();
		window.addEventListener('resize', measureSetWidth);
		
		return () => window.removeEventListener('resize', measureSetWidth);
	}, [measureSetWidth]);

	// Repeat logos enough times to always fill the viewport + overflow
	// Need at least 2 sets; more if logos are few and viewport is wide
	const repeatCount = Math.max(2, Math.ceil(3000 / Math.max(sortedLogos.length * 200, 1)) + 1);
	const loopedLogos = Array.from({ length: repeatCount }, () => sortedLogos).flat();

	// ~4s per logo, minimum 16s
	const duration = `${Math.max(sortedLogos.length * 4, 16)}s`;

	// Dynamic keyframes using measured pixel width
	const marqueeKeyframes = setWidth > 0
		? `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-${setWidth}px); } }`
		: '';

	// Responsive card visibility
	useEffect(() => {
		const updateCardsVisible = () => {
			if (typeof window !== 'undefined') {
				if (window.innerWidth >= 1024) {
					// Desktop: use configured cards_per_view
					setResponsiveCardsVisible(cards_per_view || 3);
				} else if (window.innerWidth >= 768) {
					// Tablet: show 2 cards
					setResponsiveCardsVisible(2);
				} else {
					// Mobile: show 1 card
					setResponsiveCardsVisible(1);
				}
			}
		};

		updateCardsVisible();
		window.addEventListener('resize', updateCardsVisible);
		
		return () => window.removeEventListener('resize', updateCardsVisible);
	}, [cards_per_view]);

	// Reset currentIndex when responsive cards visible changes
	useEffect(() => {
		const newMaxIndex = Math.max(0, sortedLogos.length - responsiveCardsVisible);
		if (currentIndex > newMaxIndex) {
			setCurrentIndex(newMaxIndex);
		}
	}, [responsiveCardsVisible, sortedLogos.length, currentIndex]);

	// Manual variant navigation
	const cardsVisible = cards_per_view || 3;
	const maxIndex = Math.max(0, sortedLogos.length - responsiveCardsVisible);
	const canGoPrev = currentIndex > 0;
	const canGoNext = currentIndex < maxIndex;

	const handlePrev = () => {
		if (canGoPrev) {
			setCurrentIndex((prev) => Math.max(0, prev - responsiveCardsVisible));
		}
	};

	const handleNext = () => {
		if (canGoNext) {
			setCurrentIndex((prev) => Math.min(maxIndex, prev + responsiveCardsVisible));
		}
	};

	// Render auto marquee variant
	if (variant === 'auto') {
		return (
			<div
				className="w-full flex flex-col gap-6 md:gap-10 pb-8 md:pb-10 pt-4"
				style={{ background: bgColor }}
				data-directus={setAttr({ collection: 'block_logo_carousel', item: id, fields: ['tagline', 'logos'], mode: 'popover' })}
			>
				<style>{MARQUEE_STYLES}{marqueeKeyframes}</style>

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
							ref={trackRef}
							className="flex items-center w-max"
							style={{ animation: setWidth > 0 ? `marquee ${duration} linear infinite` : 'none' }}
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
											className="marquee-item flex items-center shrink-0 opacity-80 hover:opacity-100 transition-opacity"
											aria-label={item.name ?? 'Partner'}
										>
											{inner}
										</a>
									);
								}

								return (
									<div key={key} className="marquee-item flex items-center shrink-0 opacity-80">
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

	// Calculate card widths for responsive display
	const cardGapMobile = 16; // 4 * 4px
	const cardGapTablet = 20; // 5 * 4px
	const cardGapDesktop = 24; // 6 * 4px

	// Render manual card-based variant
	return (
		<div
			className="w-full py-6 md:py-8 lg:py-10"
			style={{ background: '#F7F7F7' }}
			data-directus={setAttr({ collection: 'block_logo_carousel', item: id, fields: ['tagline', 'logos', 'variant'], mode: 'popover' })}
		>
			<Container>
				<style>{`
					.manual-carousel-card {
						min-width: 100%;
					}
					@media (min-width: 768px) {
						.manual-carousel-card {
							min-width: calc(50% - ${cardGapTablet / 2}px);
						}
					}
					@media (min-width: 1024px) {
						.manual-carousel-card {
							min-width: calc(${100 / cardsVisible}% - ${(cardGapDesktop * (cardsVisible - 1)) / cardsVisible}px);
						}
					}
				`}</style>
				<div className="flex flex-col gap-8 md:gap-12 lg:gap-16 p-6 md:p-8 lg:p-10 rounded-2xl" style={{ background: bgColor }}>
					{/* Tagline */}
					{tagline && (
						<div className="w-full text-center">
							<h2 className="font-sans font-medium text-[24px] sm:text-[32px] md:text-[40px] leading-[1.25] text-[#2d3236]" dangerouslySetInnerHTML={{ __html: tagline }} />
						</div>
					)}

					{/* Cards container */}
					{sortedLogos.length > 0 && (
						<div className="flex flex-col gap-3 md:gap-4 items-end">
							{/* Scrollable cards */}
							<div className="w-full overflow-hidden">
								<div
									className="flex gap-4 md:gap-5 lg:gap-6 transition-transform duration-500 ease-in-out"
									style={{ transform: `translateX(-${currentIndex * (100 / responsiveCardsVisible)}%)` }}
								>
									{sortedLogos.map((item) => {
										const cardContent = (
											<div
												key={item.id}
												className="bg-[#ced7db] rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-2 md:gap-3 shadow-[4px_4px_54px_0px_rgba(0,0,0,0.16)] manual-carousel-card shrink-0"
											>
												{/* Logo */}
												{item.logo && (
													<div className="h-[80px] md:h-[90px] lg:h-[104px] flex items-center shrink-0">
														<DirectusImage
															uuid={item.logo}
															alt={item.name ?? 'Credential badge'}
															width={200}
															height={104}
															className="h-full w-auto object-contain max-w-[160px] md:max-w-[180px] lg:max-w-[200px]"
														/>
													</div>
												)}

												{/* Text content */}
												<div className="flex flex-col gap-1 md:gap-2 px-1">
													{item.name && (
														<h3 className="font-sans font-semibold text-[16px] md:text-[18px] lg:text-[20px] leading-[1.2] text-[#2d3236]">
															{item.name}
														</h3>
													)}
													{item.subtitle && (
														<p className="font-sans font-semibold text-[11px] md:text-[12px] leading-[1.17] text-[#2d3236]">
															{item.subtitle}
														</p>
													)}
												</div>
											</div>
										);

										if (item.url) {
											return (
												<a
													key={item.id}
													href={item.url}
													target="_blank"
													rel="noopener noreferrer"
													className="hover:opacity-90 transition-opacity"
													aria-label={item.name ?? 'Credential'}
												>
													{cardContent}
												</a>
											);
										}

										return cardContent;
									})}
								</div>
							</div>

							{/* Navigation arrows */}
							{show_navigation && sortedLogos.length > responsiveCardsVisible && (
								<div className="flex gap-3 md:gap-4 items-center">
									<button
										onClick={handlePrev}
										disabled={!canGoPrev}
										className="bg-[#ced7db] rounded-2xl p-2 size-8 flex items-center justify-center disabled:opacity-40 hover:opacity-80 transition-opacity"
										aria-label="Previous"
									>
										<svg width="25" height="30" viewBox="0 0 25 30" fill="none">
											<path d="M15 7.5L7.5 15L15 22.5" stroke="#2d3236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
									<button
										onClick={handleNext}
										disabled={!canGoNext}
										className="bg-[#ced7db] rounded-2xl p-2 size-8 flex items-center justify-center disabled:opacity-40 hover:opacity-80 transition-opacity"
										aria-label="Next"
									>
										<svg width="25" height="30" viewBox="0 0 25 30" fill="none">
											<path d="M10 7.5L17.5 15L10 22.5" stroke="#2d3236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</Container>
		</div>
	);
}
