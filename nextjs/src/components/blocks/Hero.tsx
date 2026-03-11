'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import Tagline from '../ui/Tagline';
import BaseText from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';
import { useNavigationOptional } from '@/contexts/NavigationContext';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';

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
	color: string | null;
}

interface HeroSlide {
	id: string;
	sort: number | null;
	background_image: string | null;
	background_video: string | null;
	background_color: string | null;
	tagline_image: string | null;
	subject_image: string | null;
	subject_video: string | null;
	headline: string | null;
	headline_emphasis: string | null;
	description: string | null;
	text_placement: TextPlacement | null;
	button_1_text: string | null;
	button_1_url: string | null;
	button_1_page?: { permalink: string } | null;
	button_1_variant: string | null;
	button_1_bg_color: string | null;
	button_1_text_color: string | null;
	button_1_hover_bg_color: string | null;
	button_1_hover_text_color: string | null;
	button_2_text: string | null;
	button_2_url: string | null;
	button_2_page?: { permalink: string } | null;
	button_2_variant: string | null;
	button_2_bg_color: string | null;
	button_2_text_color: string | null;
	button_2_hover_bg_color: string | null;
	button_2_hover_text_color: string | null;
	nav_text_color: string | null;
	nav_text_hover_color: string | null;
	nav_scrolled_background_color: string | null;
	nav_scrolled_text_color: string | null;
	nav_scrolled_text_hover_color: string | null;
	nav_dropdown_background_color: string | null;
	nav_dropdown_text_color: string | null;
	nav_dropdown_text_hover_color: string | null;
	nav_hide_logo: boolean | null;
	nav_logo_override: string | null;
	nav_cta_background_color: string | null;
	nav_cta_text_color: string | null;
	nav_scrolled_cta_background_color: string | null;
	nav_scrolled_cta_text_color: string | null;
	nav_active_text_color: string | null;
	nav_active_underline_color: string | null;
	nav_scrolled_active_text_color: string | null;
	nav_scrolled_active_underline_color: string | null;
	carousel_indicator_color: string | null;
	enable_gradient_overlay: boolean | null;
	overlay_image: string | null;
	overlay_opacity: number | null;
}

interface HeroButton {
	id: string;
	label: string | null;
	variant: string | null;
	url: string | null;
	type: 'url' | 'page' | 'post';
	pagePermalink?: string | null;
	postSlug?: string | null;
	bgColor?: string | null;
	textColor?: string | null;
	hoverBgColor?: string | null;
	hoverTextColor?: string | null;
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
		video?: string | null;
		background_color?: string | null;
		enable_carousel?: boolean | null;
		autoplay_interval?: number | null;
		enable_gradient_overlay?: boolean | null;
		overlay_image?: string | null;
		overlay_opacity?: number | null;
		height?: string | null;
		expanded_text_placement?: TextPlacement | null;
		expanded_text_alignment?: 'left' | 'center' | 'right' | null;
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

function sanitizeHtml(html: string | null): string {
	if (!html) return '';
	if (typeof window === 'undefined') return html;

	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'span', 'a', 'ul', 'ol', 'li', 'blockquote'],
		ALLOWED_ATTR: ['style', 'href', 'target', 'rel'],
	});
}

function buildSlideButtons(slide: HeroSlide): HeroButton[] {
	const buttons: HeroButton[] = [];

	if (slide.button_1_text) {
		buttons.push({
			id: `${slide.id}-btn1`,
			label: slide.button_1_text,
			variant: slide.button_1_variant || 'primary',
			url: slide.button_1_url,
			type: slide.button_1_page ? 'page' : 'url',
			pagePermalink: slide.button_1_page?.permalink,
			bgColor: slide.button_1_bg_color,
			textColor: slide.button_1_text_color,
			hoverBgColor: slide.button_1_hover_bg_color,
			hoverTextColor: slide.button_1_hover_text_color,
		});
	}

	if (slide.button_2_text) {
		buttons.push({
			id: `${slide.id}-btn2`,
			label: slide.button_2_text,
			variant: slide.button_2_variant || 'secondary',
			url: slide.button_2_url,
			type: slide.button_2_page ? 'page' : 'url',
			pagePermalink: slide.button_2_page?.permalink,
			bgColor: slide.button_2_bg_color,
			textColor: slide.button_2_text_color,
			hoverBgColor: slide.button_2_hover_bg_color,
			hoverTextColor: slide.button_2_hover_text_color,
		});
	}

	return buttons;
}

function HeroVideo({ videoId, posterId, fill, className, loop = true, onEnded, priority = false }: {
	videoId: string;
	posterId?: string | null;
	fill?: boolean;
	className?: string;
	loop?: boolean;
	onEnded?: () => void;
	priority?: boolean;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const videoSrc = getDirectusAssetURL(videoId);

	return (
		<>
			{/* Preload hint for priority videos (first visible slide) */}
			{priority && (
				<link rel="preload" href={videoSrc} as="video" type="video/mp4" />
			)}
			{posterId && !isLoaded && (
				<DirectusImage
					uuid={posterId}
					alt="Video poster"
					fill={fill}
					sizes="100vw"
					className={cn(className, 'transition-opacity duration-500')}
					priority
				/>
			)}
			<video
				ref={videoRef}
				src={videoSrc}
				autoPlay
				muted
				loop={loop}
				playsInline
				preload="auto"
				onCanPlay={() => setIsLoaded(true)}
				onEnded={onEnded}
				className={cn(
					fill ? 'absolute inset-0 size-full' : 'size-full',
					className,
					'transition-opacity duration-500',
					!isLoaded && 'opacity-0',
				)}
			/>
		</>
	);
}

export default function Hero({ data }: HeroProps) {
	const {
		id, layout, tagline, tagline_type, tagline_image, tagline_image_alt,
		headline_lines, description, image, video, background_color, button_group,
		enable_carousel, autoplay_interval, enable_gradient_overlay,
		overlay_image, overlay_opacity,
		expanded_text_placement, expanded_text_alignment,
		height,
		slides,
	} = data;

	const heightStyle = height ? { minHeight: `${height}vh` } : undefined;
	const heightClass = height ? '' : 'min-h-screen';

	const sortedHeadlineLines = useMemo(
		() => (headline_lines ? [...headline_lines].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []),
		[headline_lines]
	);

	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const sortedSlides = useMemo(
		() => (slides ? [...slides].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []),
		[slides]
	);
	const isCarousel = layout === 'image_expanded' && enable_carousel && sortedSlides.length > 0;
	const interval = autoplay_interval ?? 4000;

	// Navigation context for dynamic nav colors
	const navigationContext = useNavigationOptional();
	const setNavColors = navigationContext?.setColors;
	const resetNavColors = navigationContext?.resetColors;

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
	}, [sortedSlides.length]);

	// Check if current slide has a video — if so, let onEnded advance instead of the timer
	const currentSlideHasVideo = isCarousel && sortedSlides[currentSlide] &&
		(sortedSlides[currentSlide].background_video || sortedSlides[currentSlide].subject_video);

	useEffect(() => {
		if (!isCarousel || isPaused || sortedSlides.length <= 1 || currentSlideHasVideo) return;
		const timer = setInterval(nextSlide, interval);

		return () => clearInterval(timer);
	}, [isCarousel, isPaused, nextSlide, interval, sortedSlides.length, currentSlideHasVideo]);

	// Update navigation colors when slide changes
	useEffect(() => {
		if (!isCarousel || !setNavColors || sortedSlides.length === 0) {
			return;
		}

		const slide = sortedSlides[currentSlide];
		const navData = {
			textColor: slide.nav_text_color,
			textHoverColor: slide.nav_text_hover_color,
			scrolledBackgroundColor: slide.nav_scrolled_background_color,
			scrolledTextColor: slide.nav_scrolled_text_color,
			scrolledTextHoverColor: slide.nav_scrolled_text_hover_color,
			dropdownBackgroundColor: slide.nav_dropdown_background_color,
			dropdownTextColor: slide.nav_dropdown_text_color,
			dropdownTextHoverColor: slide.nav_dropdown_text_hover_color,
			ctaBackgroundColor: slide.nav_cta_background_color,
			ctaTextColor: slide.nav_cta_text_color,
			scrolledCtaBackgroundColor: slide.nav_scrolled_cta_background_color,
			scrolledCtaTextColor: slide.nav_scrolled_cta_text_color,
			activeTextColor: slide.nav_active_text_color,
			activeUnderlineColor: slide.nav_active_underline_color,
			scrolledActiveTextColor: slide.nav_scrolled_active_text_color,
			scrolledActiveUnderlineColor: slide.nav_scrolled_active_underline_color,
			hideLogo: slide.nav_hide_logo,
			logoOverride: slide.nav_logo_override,
		};

		if (slide?.nav_text_color || slide?.nav_text_hover_color || slide?.nav_scrolled_background_color || slide?.nav_scrolled_text_color || slide?.nav_scrolled_text_hover_color || slide?.nav_dropdown_background_color || slide?.nav_dropdown_text_color || slide?.nav_dropdown_text_hover_color || slide?.nav_cta_background_color || slide?.nav_cta_text_color || slide?.nav_scrolled_cta_background_color || slide?.nav_scrolled_cta_text_color || slide?.nav_active_text_color || slide?.nav_active_underline_color || slide?.nav_scrolled_active_text_color || slide?.nav_scrolled_active_underline_color || slide?.nav_hide_logo !== null || slide?.nav_logo_override) {
			setNavColors(navData);
		} else {
			// Reset to default if slide has no nav overrides
			if (resetNavColors) {
				resetNavColors();
			}
		}

		// Cleanup: reset colors when component unmounts
		return () => {
			if (resetNavColors) {
				resetNavColors();
			}
		};
	}, [currentSlide, isCarousel, sortedSlides, setNavColors, resetNavColors]);

	// image_expanded layout — full-bleed background with optional carousel
	if (layout === 'image_expanded') {
		const slide = isCarousel ? sortedSlides[currentSlide] : null;
		const bgVideo = slide?.background_video ?? video;
		const bgImage = slide?.background_image ?? image;
		const bgColor = slide?.background_color ?? background_color;
		const placement: TextPlacement = slide?.text_placement ?? expanded_text_placement ?? 'center_left';
		const pc = placementClasses[placement];

		// Block-level text alignment (left/center/right) — only applied in non-carousel mode
		const textAlign = expanded_text_alignment ?? 'left';
		const textAlignClass =
			textAlign === 'center' ? 'text-center items-center' :
			textAlign === 'right'  ? 'text-right items-end' :
			                         'text-left items-start';

		return (
			<section
				className={cn('relative w-full overflow-hidden', heightClass)}
				style={heightStyle}
				onMouseEnter={() => setIsPaused(false)}
				onMouseLeave={() => setIsPaused(false)}
			>
				{/* Background layer — wrapper ensures stable DOM structure across slides */}
				<div className="absolute inset-0" style={!bgVideo && !bgImage && bgColor ? { background: bgColor } : undefined}>
					{bgVideo ? (
						<HeroVideo
							key={isCarousel ? `bg-video-${currentSlide}` : 'bg-video'}
							videoId={bgVideo}
							posterId={bgImage}
							fill
							className="object-cover"
							loop={!isCarousel}
							onEnded={isCarousel ? nextSlide : undefined}
							priority={!isCarousel || currentSlide === 0}
						/>
					) : bgImage ? (
						<DirectusImage
							uuid={bgImage}
							alt="Hero image"
							fill
							sizes="100vw"
							className="object-cover"
							priority
						/>
					) : !bgColor ? (
						<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
					) : null}
				</div>

				{/* Gradient overlay for text legibility (block-level or slide-level toggle) */}
				{(slide?.enable_gradient_overlay ?? enable_gradient_overlay) && (
					<div
						className="absolute inset-0 pointer-events-none z-[1]"
						style={{
							background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(30,30,30,0.23) 25%, rgba(30,30,30,0) 50%, rgba(30,30,30,0.41) 75%, rgba(30,30,30,1) 100%)',
						}}
					/>
				)}

				{/* Overlay image (gradient texture / pattern) with configurable opacity */}
				{(() => {
					const overlayImg = slide?.overlay_image ?? overlay_image;
					const overlayOp = slide?.overlay_opacity ?? overlay_opacity ?? 0.5;
					if (!overlayImg) return null;
					
					return (
						<div
							className="absolute inset-0 pointer-events-none z-[2]"
							style={{ opacity: overlayOp }}
						>
							<DirectusImage
								uuid={overlayImg}
								alt=""
								fill
								sizes="100vw"
								className="object-cover"
							/>
						</div>
					);
				})()}

				{/* Content overlay */}
				<div className={cn('relative z-[10] flex flex-col mx-auto px-6 md:px-16 lg:px-[120px] py-16 gap-8', heightClass, pc.outer)} style={heightStyle}>
					{/* Text content block */}
					<div className={cn('flex flex-col gap-6 text-white max-w-[1200px]', pc.text, !isCarousel && textAlignClass)}>
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

						<h1
							className="leading-tight"
							data-directus={setAttr({
								collection: 'block_hero',
								item: id,
								fields: 'headline_lines',
								mode: 'modal',
							})}
						>
							{slide ? (
								<>
									<span className="block text-4xl md:text-5xl xl:text-6xl font-semibold" dangerouslySetInnerHTML={{ __html: sanitize(slide.headline) }} />
									{slide.headline_emphasis && (
										<span className="block text-4xl md:text-5xl xl:text-6xl font-semibold" dangerouslySetInnerHTML={{ __html: sanitize(slide.headline_emphasis) }} />
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
											...(line.color ? { color: line.color } : {}),
										}}
										dangerouslySetInnerHTML={{ __html: sanitize(line.text) }}
									/>
								))
							)}
						</h1>

						{(slide?.description || description) && (
							<div
								className="text-base md:text-lg text-white/80 max-w-lg [&_a]:underline [&_a]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
								data-directus={setAttr({
									collection: 'block_hero',
									item: id,
									fields: 'description',
									mode: 'popover',
								})}
								dangerouslySetInnerHTML={{ __html: sanitizeHtml(slide?.description ?? description) }}
							/>
						)}

						{(() => {
							// Use slide buttons if in carousel mode, otherwise use hero-level button_group
							const slideButtons = slide ? buildSlideButtons(slide) : [];
							const buttonsToRender = slideButtons.length > 0 ? slideButtons : (button_group?.buttons || []);

							if (buttonsToRender.length === 0) return null;

							return (
								<div
									data-directus={
										slide
											? setAttr({
													collection: 'block_hero_slide',
													item: slide.id,
													fields: [
														'button_1_text',
														'button_1_url',
														'button_1_page',
														'button_2_text',
														'button_2_url',
														'button_2_page',
													],
													mode: 'modal',
												})
											: setAttr({
													collection: 'block_button_group',
													item: button_group?.id || '',
													fields: 'buttons',
													mode: 'modal',
												})
									}
									className="mt-2"
								>
									<ButtonGroup buttons={buttonsToRender} />
								</div>
							);
						})()}
					</div>

					{/* Right: subject image/video with decorative circles (only for center_left placement) */}
					{(slide?.subject_image || slide?.subject_video) && placement === 'center_left' && (
						<div className="relative flex-1 hidden md:flex items-center justify-center">
							<div className="absolute size-96 rounded-full border border-white/20" />
							<div className="absolute size-72 rounded-full border border-white/20" />
							<div className="relative h-[500px] w-full max-w-sm">
								{slide.subject_video ? (
									<HeroVideo
										key={isCarousel ? `subj-video-${currentSlide}` : 'subj-video'}
										videoId={slide.subject_video}
										posterId={slide.subject_image}
										fill
										className="object-contain object-bottom"
										loop={!isCarousel}
										onEnded={isCarousel ? nextSlide : undefined}
									/>
								) : slide.subject_image ? (
									<DirectusImage
										uuid={slide.subject_image}
										alt={slide.headline ?? ''}
										fill
										sizes="(max-width: 768px) 100vw, 40vw"
										className="object-contain object-bottom"
									/>
								) : null}
							</div>
						</div>
					)}
				</div>

				{/* Carousel indicators */}
				{isCarousel && sortedSlides.length > 1 && (
					<div className="absolute bottom-12 left-6 md:left-16 lg:left-[120px] flex items-center gap-2 z-20">
						{sortedSlides.map((_, i) => {
							const isActive = i === currentSlide;
							const activeSlideColor = sortedSlides[currentSlide]?.carousel_indicator_color;

							return (
								<button
									key={i}
									aria-label={`Go to slide ${i + 1}`}
									onClick={() => setCurrentSlide(i)}
									className={cn(
										'h-2 rounded-full transition-all duration-300',
										isActive ? 'w-[68px]' : 'w-2 bg-white/40 hover:bg-white/60',
										isActive && !activeSlideColor && 'bg-white',
									)}
									style={isActive && activeSlideColor ? { backgroundColor: activeSlideColor } : undefined}
								/>
							);
						})}
					</div>
				)}
			</section>
		);
	}

	// image_center layout — full-bleed background with vertically centered content column
	if (layout === 'image_center') {
		return (
			<section
				className={cn('relative w-full overflow-hidden flex flex-col items-center justify-center', heightClass)}
				style={{
					...heightStyle,
					...(background_color ? { backgroundColor: background_color } : {}),
				}}
			>
				{/* Overlay image (gradient texture / pattern) */}
				{overlay_image && (
					<div
						className="absolute inset-0 pointer-events-none z-[1]"
						style={{ opacity: overlay_opacity ?? 0.5 }}
					>
						<DirectusImage
							uuid={overlay_image}
							alt=""
							fill
							sizes="100vw"
							className="object-cover"
						/>
					</div>
				)}

				<div className="relative z-[10] flex flex-col items-center gap-10 w-full max-w-[890px] mx-auto">
					{/* Text content */}
					<div className="flex flex-col items-center gap-6 text-center w-full">
						{tagline_type === 'image' && tagline_image ? (
							<div className="relative h-10 w-40">
								<DirectusImage
									uuid={tagline_image}
									alt={tagline_image_alt ?? ''}
									fill
									sizes="160px"
									className="object-contain"
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
										...(line.color ? { color: line.color } : {}),
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
								className="flex justify-center mt-2"
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

					{/* Media — contained at fixed aspect ratio */}
					{(image || video) && (
						<div
							className="relative w-full aspect-[890/520] overflow-hidden"
							data-directus={setAttr({
								collection: 'block_hero',
								item: id,
								fields: ['image', 'video', 'layout'],
								mode: 'modal',
							})}
						>
							{video ? (
								<HeroVideo videoId={video} posterId={image} fill className="object-cover" />
							) : image ? (
								<DirectusImage
									uuid={image}
									alt={tagline || 'Hero Image'}
									fill
									sizes="890px"
									className="object-cover"
								/>
							) : null}
						</div>
					)}
				</div>
			</section>
		);
	}

	// Standard layouts: image_left, image_right
	return (
		<section
			className={cn(
				'relative w-full mx-auto flex flex-col gap-6 md:gap-10 py-16 px-6 sm:px-10 md:px-16 lg:px-[120px]',
				layout === 'image_left'
					? 'md:flex-row-reverse items-center'
					: 'md:flex-row items-center',
			)}
		>
			<div className="flex flex-col gap-4 w-full md:w-1/2 items-start">
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
								...(line.color ? { color: line.color } : {}),
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
						className="mt-6"
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
			{(image || video) && (
				<div
					className="relative w-full md:w-1/2 h-[562px]"
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: ['image', 'video', 'layout'],
						mode: 'modal',
					})}
				>
					{video ? (
						<HeroVideo videoId={video} posterId={image} fill className="object-contain" />
					) : image ? (
						<DirectusImage
							uuid={image}
							alt={tagline || 'Hero Image'}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-contain"
						/>
					) : null}
				</div>
			)}
		</section>
	);
}
