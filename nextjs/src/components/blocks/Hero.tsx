'use client';

import { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import Tagline from '../ui/Tagline';
import BaseText from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';

const fontSizeMap: Record<string, string> = {
	sm: 'text-2xl',
	md: 'text-4xl',
	lg: 'text-5xl',
	xl: 'text-6xl',
	'2xl': 'text-7xl',
	'3xl': 'text-8xl',
};

type TextPlacement = 'center_left' | 'bottom_center' | 'bottom_left' | 'center_center';

const placementClasses: Record<TextPlacement, { outer: string; text: string }> = {
	center_left:   { outer: 'justify-center items-start',    text: 'text-left' },
	bottom_center: { outer: 'justify-end items-center pb-20', text: 'text-center items-center' },
	bottom_left:   { outer: 'justify-end items-start pb-20', text: 'text-left' },
	center_center: { outer: 'justify-center items-center',   text: 'text-center items-center' },
};

interface HeadlineLine {
	id: string;
	sort: number | null;
	text: string | null;
	font_weight: string | null;
	font_style: string | null;
	font_size: string | null;
}

interface HeroSlide {
	id: string;
	sort: number | null;
	background_image: string | null;
	background_color: string | null;
	tagline_image: string | null;
	subject_image: string | null;
	headline: string | null;
	headline_emphasis: string | null;
	description: string | null;
	text_placement: TextPlacement | null;
}

interface HeroButton {
	id: string;
	label: string | null;
	variant: string | null;
	url: string | null;
	type: 'url' | 'page' | 'post';
	pagePermalink?: string | null;
	postSlug?: string | null;
}

interface HeroProps {
	data: {
		id: string;
		tagline: string;
		tagline_type?: 'text' | 'image' | null;
		tagline_image?: string | null;
		tagline_image_alt?: string | null;
		description: string;
		layout: 'image_left' | 'image_center' | 'image_right' | 'image_expanded';
		image: string | null;
		enable_carousel?: boolean | null;
		autoplay_interval?: number | null;
		headline_lines?: HeadlineLine[];
		slides?: HeroSlide[];
		button_group?: {
			id: string;
			buttons: HeroButton[];
		};
	};
}

function sanitize(html: string | null): string {
	if (!html) return '';
	if (typeof window === 'undefined') return html;

	return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'span', 'br'], ALLOWED_ATTR: ['style'] });
}

export default function Hero({ data }: HeroProps) {
	const { id, layout, tagline, tagline_type, tagline_image, tagline_image_alt, headline_lines, description, image, button_group, enable_carousel, autoplay_interval, slides } =
		data;

	const sortedHeadlineLines = headline_lines
		? [...headline_lines].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
		: [];

	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const sortedSlides = slides ? [...slides].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : [];
	const isCarousel = layout === 'image_expanded' && enable_carousel && sortedSlides.length > 0;
	const interval = autoplay_interval ?? 4000;

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
	}, [sortedSlides.length]);

	useEffect(() => {
		if (!isCarousel || isPaused || sortedSlides.length <= 1) return;
		const timer = setInterval(nextSlide, interval);

		return () => clearInterval(timer);
	}, [isCarousel, isPaused, nextSlide, interval, sortedSlides.length]);

	// image_expanded layout — full-bleed background with optional carousel
	if (layout === 'image_expanded') {
		const slide = isCarousel ? sortedSlides[currentSlide] : null;
		const bgImage = slide?.background_image ?? image;
		const bgColor = slide?.background_color;
		const placement: TextPlacement = slide?.text_placement ?? 'center_left';
		const pc = placementClasses[placement];

		return (
			<section
				className="relative w-full min-h-screen overflow-hidden"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				{/* Background layer */}
				{bgImage ? (
					<DirectusImage
						uuid={bgImage}
						alt="Hero image"
						fill
						sizes="100vw"
						className="object-cover"
						priority
					/>
				) : bgColor ? (
					<div className="absolute inset-0" style={{ background: bgColor }} />
				) : (
					<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
				)}

				{/* Gradient overlay for text legibility */}
				{/* <div
					className="absolute inset-0 pointer-events-none"
					style={{
						background: 'linear-gradient(180deg, rgba(30,30,30,0.85) 0%, rgba(30,30,30,0) 35%, rgba(30,30,30,0) 60%, rgba(30,30,30,0.55) 78%, rgba(30,30,30,0.95) 100%)',
					}}
				/> */}

				{/* Content overlay */}
				<div className={cn('relative z-10 flex flex-col min-h-screen max-w-[1200px] mx-auto px-6 md:px-16 py-16 gap-8', pc.outer)}>
					{/* Text content block */}
					<div className={cn('flex flex-col gap-6 text-white max-w-3xl', pc.text)}>
						{slide?.tagline_image ? (
							<div className="relative h-10 w-40">
								<DirectusImage
									uuid={slide.tagline_image}
									alt="Tagline"
									fill
									sizes="160px"
									className="object-contain object-left"
								/>
							</div>
						) : tagline_type === 'image' && tagline_image ? (
							<div className="relative h-10 w-40">
								<DirectusImage
									uuid={tagline_image}
									alt={tagline_image_alt ?? ''}
									fill
									sizes="160px"
									className="object-contain object-left"
								/>
							</div>
						) : tagline ? (
							<Tagline
								tagline={tagline}
								data-directus={setAttr({
									collection: 'block_hero',
									item: id,
									fields: 'tagline',
									mode: 'popover',
								})}
							/>
						) : null}

						<h1 className="leading-tight">
							{slide ? (
								<>
									<span className="block text-4xl md:text-5xl xl:text-6xl font-bold">{slide.headline}</span>
									{slide.headline_emphasis && (
										<em className="block text-4xl md:text-5xl xl:text-6xl font-light italic">
											{slide.headline_emphasis}
										</em>
									)}
								</>
							) : (
								sortedHeadlineLines.map((line) => (
									<span
										key={line.id}
										className={`block ${fontSizeMap[line.font_size ?? '2xl'] ?? 'text-7xl'}`}
										style={{
											fontWeight: line.font_weight ?? '600',
											fontStyle: line.font_style ?? 'normal',
										}}
										dangerouslySetInnerHTML={{ __html: sanitize(line.text) }}
									/>
								))
							)}
						</h1>

						{(slide?.description || description) && (
							<p className="text-base md:text-lg text-white/80 max-w-lg">
								{slide?.description ?? description}
							</p>
						)}

						{button_group && button_group.buttons.length > 0 && (
							<div
								data-directus={setAttr({
									collection: 'block_button_group',
									item: button_group.id,
									fields: 'buttons',
									mode: 'modal',
								})}
								className='mt-2'
							>
								<ButtonGroup buttons={button_group.buttons} />
							</div>
						)}
					</div>

					{/* Right: subject image with decorative circles (only for center_left placement) */}
					{slide?.subject_image && placement === 'center_left' && (
						<div className="relative flex-1 hidden md:flex items-center justify-center">
							<div className="absolute size-96 rounded-full border border-white/20" />
							<div className="absolute size-72 rounded-full border border-white/20" />
							<div className="relative h-[500px] w-full max-w-sm">
								<DirectusImage
									uuid={slide.subject_image}
									alt={slide.headline ?? ''}
									fill
									sizes="(max-width: 768px) 100vw, 40vw"
									className="object-contain object-bottom"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Carousel indicators */}
				{isCarousel && sortedSlides.length > 1 && (
					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
						{sortedSlides.map((_, i) => (
							<button
								key={i}
								aria-label={`Go to slide ${i + 1}`}
								onClick={() => setCurrentSlide(i)}
								className={cn(
									'h-2 rounded-full transition-all duration-300',
									i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60',
								)}
							/>
						))}
					</div>
				)}
			</section>
		);
	}

	// Standard layouts: image_left, image_center, image_right
	return (
		<section
			className={cn(
				'relative w-full mx-auto flex flex-col gap-6 md:gap-12',
				layout === 'image_center'
					? 'items-center text-center'
					: layout === 'image_left'
						? 'md:flex-row-reverse items-center'
						: 'md:flex-row items-center',
			)}
		>
			<div
				className={cn(
					'flex flex-col gap-4 w-full',
					layout === 'image_center' ? 'md:w-3/4 xl:w-2/3 items-center' : 'md:w-1/2 items-start',
				)}
			>
				{tagline_type === 'image' && tagline_image ? (
					<div className="relative h-10 w-40">
						<DirectusImage
							uuid={tagline_image}
							alt={tagline_image_alt ?? ''}
							fill
							sizes="160px"
							className="object-contain object-left"
						/>
					</div>
				) : (
					<Tagline
						tagline={tagline}
						data-directus={setAttr({
							collection: 'block_hero',
							item: id,
							fields: 'tagline',
							mode: 'popover',
						})}
					/>
				)}
				<h2
					className="leading-tight"
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: 'headline_lines',
						mode: 'modal',
					})}
				>
					{sortedHeadlineLines.map((line) => (
						<span
							key={line.id}
							className={`block ${fontSizeMap[line.font_size ?? '2xl'] ?? 'text-7xl'}`}
							style={{
								fontWeight: line.font_weight ?? '600',
								fontStyle: line.font_style ?? 'normal',
							}}
							dangerouslySetInnerHTML={{ __html: sanitize(line.text) }}
						/>
					))}
				</h2>
				{description && (
					<BaseText
						content={description}
						data-directus={setAttr({
							collection: 'block_hero',
							item: id,
							fields: 'description',
							mode: 'popover',
						})}
					/>
				)}
				{button_group && button_group.buttons.length > 0 && (
					<div
						className={cn(layout === 'image_center' && 'flex justify-center', 'mt-6')}
						data-directus={setAttr({
							collection: 'block_button_group',
							item: button_group.id,
							fields: 'buttons',
							mode: 'modal',
						})}
					>
						<ButtonGroup buttons={button_group.buttons} />
					</div>
				)}
			</div>
			{image && (
				<div
					className={cn(
						'relative w-full',
						layout === 'image_center' ? 'md:w-3/4 xl:w-2/3 h-[400px]' : 'md:w-1/2 h-[562px]',
					)}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: ['image', 'layout'],
						mode: 'modal',
					})}
				>
					<DirectusImage
						uuid={image}
						alt={tagline || 'Hero Image'}
						fill
						sizes={layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
						className="object-contain"
					/>
				</div>
			)}
		</section>
	);
}
