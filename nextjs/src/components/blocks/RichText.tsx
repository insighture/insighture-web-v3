'use client';

import { useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Text from '@/components/ui/Text';
import Button from '@/components/blocks/Button';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

const fontSizeMap: Record<string, string> = {
	sm: 'text-2xl',
	md: 'text-4xl',
	lg: 'text-5xl',
	xl: 'text-6xl',
	'2xl': 'text-7xl',
	'3xl': 'text-8xl',
};

interface RichTextProps {
	data: {
		id: string;
		variant?: 'default' | 'hero' | null;
		tagline?: string;
		headline?: string;
		content?: string;
		alignment?: 'left' | 'center' | 'right';
		background_color?: string | null;
		background_image?: string | null;
		text_color?: string | null;
		emphasis_color?: string | null;
		show_quotes?: boolean | null;
		button_text?: string | null;
		button_url?: string | null;
		button_page?: { permalink: string | null };
		button_variant?: string | null;
		button_bg_color?: string | null;
		button_text_color?: string | null;
		button_border_color?: string | null;
		headline_font_size?: string | null;
		headline_font_weight?: string | null;
		headline_font_style?: string | null;
		headline_color?: string | null;
	};
	className?: string;
}

const RichText = ({ data, className }: RichTextProps) => {
	const {
		id,
		variant = 'default',
		tagline,
		headline,
		content,
		alignment = 'left',
		background_color,
		background_image,
		text_color,
		emphasis_color,
		show_quotes,
		button_text,
		button_url,
		button_page,
		button_variant,
		button_bg_color,
		button_text_color,
		button_border_color,
		headline_font_size,
		headline_font_weight,
		headline_font_style,
		headline_color,
	} = data;
	const scopeId = useId().replace(/:/g, '');
	const hasBackground = !!background_color || !!background_image;
	const isHero = variant === 'hero';
	const router = useRouter();

	// prose overrides: inherit color from parent, remove max-width cap, let scoped CSS win on font-size
	const proseOverrides = 'prose-headings:text-[inherit] text-[inherit] max-w-none [&_p]:text-[inherit] [&_li]:text-[inherit] [&_a]:text-[inherit]';

	useEffect(() => {
		const container = document.querySelector(`#rt-${scopeId} .prose`);
		const links = container?.querySelectorAll('a');

		links?.forEach((link) => {
			const href = link.getAttribute('href');
			if (href && href.startsWith('/')) {
				link.onclick = (event) => {
					event.preventDefault();
					router.push(href);
				};
			}
		});

		const iframes = container?.querySelectorAll('iframe');
		iframes?.forEach((iframe) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'relative aspect-video';
			iframe.parentNode?.insertBefore(wrapper, iframe);
			wrapper.appendChild(iframe);
			iframe.style.position = 'absolute';
			iframe.style.top = '0';
			iframe.style.left = '0';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
		});
	}, [content, router, scopeId]);

	const alignClass = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';

	if (isHero) {
		return (
			<div
				id={`rt-${scopeId}`}
				className={cn(
					'relative w-full',
					hasBackground ? 'px-16 py-16 md:px-28 md:py-20' : 'px-4 sm:px-6 lg:px-16 py-16',
					className,
				)}
				style={{ color: text_color ?? undefined, backgroundColor: background_color ?? undefined }}
			>
				{background_image && (
					<DirectusImage
						uuid={background_image}
						alt=""
						fill
						sizes="100vw"
						className="object-cover pointer-events-none"
						aria-hidden="true"
					/>
				)}

				{emphasis_color && (
					<style>{`#rt-${scopeId} em, #rt-${scopeId} .rt-headline em { color: ${emphasis_color}; font-style: italic; }`}</style>
				)}

				{show_quotes && (
					<>
						<span
							className="absolute top-6 left-6 md:top-8 md:left-8 text-[120px] md:text-[160px] leading-none select-none pointer-events-none"
							style={{ color: text_color ?? 'currentColor', opacity: 0.25, fontFamily: 'Georgia, serif', lineHeight: 1 }}
							aria-hidden="true"
						>
							&ldquo;
						</span>
						<span
							className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-[120px] md:text-[160px] leading-none select-none pointer-events-none rotate-180 inline-block"
							style={{ color: text_color ?? 'currentColor', opacity: 0.25, fontFamily: 'Georgia, serif', lineHeight: 1 }}
							aria-hidden="true"
						>
							&ldquo;
						</span>
					</>
				)}

				<div className="relative w-full mx-auto">
					<div
						className={cn('flex gap-6 items-end', button_text ? 'flex-col md:flex-row md:justify-between' : 'flex-col')}
					>
						<div className="space-y-6 flex-1">
							{tagline && (
								<Tagline
									tagline={tagline}
									className={alignClass}
									data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'tagline', mode: 'popover' })}
								/>
							)}
							{headline && (
								<div
									className={cn(
										'rt-headline font-heading leading-tight',
										headline_font_size
											? fontSizeMap[headline_font_size] || 'text-5xl'
											: 'text-4xl md:text-5xl lg:text-h1',
										!headline_font_weight && 'font-normal',
										alignClass,
									)}
									style={{
										...(headline_font_weight ? { fontWeight: headline_font_weight } : {}),
										...(headline_font_style ? { fontStyle: headline_font_style } : {}),
										...(headline_color ? { color: headline_color } : {}),
									}}
									dangerouslySetInnerHTML={{ __html: headline }}
									data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'headline', mode: 'popover' })}
								/>
							)}
							{content && (
								<Text
									content={content}
									className={cn(proseOverrides, 'max-w-[900px] w-full', alignClass)}
									data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'content', mode: 'drawer' })}
								/>
							)}
						</div>
						{button_text && (
							<div className="flex-shrink-0">
								<Button
									id={`${id}-button`}
									label={button_text}
									variant={button_variant || 'outline'}
									url={button_url}
									type={button_page ? 'page' : 'url'}
									page={button_page}
									icon="arrow"
									iconPosition="right"
									bgColor={button_bg_color}
									textColor={button_text_color}
									borderColor={button_border_color}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Default variant — centered, subtle rich text without button
	return (
		<div
			id={`rt-${scopeId}`}
			className={cn(
				'relative w-full',
				hasBackground ? 'px-16 py-16 md:px-24 md:py-20' : '',
				className,
			)}
			style={{ color: text_color ?? undefined, backgroundColor: background_color ?? undefined }}
		>
			{background_image && (
				<DirectusImage
					uuid={background_image}
					alt=""
					fill
					sizes="100vw"
					className="object-cover pointer-events-none"
					aria-hidden="true"
				/>
			)}

			{(emphasis_color || hasBackground) && (
				<style>{[
					emphasis_color ? `#rt-${scopeId} em, #rt-${scopeId} .rt-headline em { color: ${emphasis_color}; font-style: italic; }` : '',
					hasBackground ? `#rt-${scopeId} .prose p { font-size: 40px; line-height: 56px; font-weight: 500; }` : '' ,
				].join(' ')}</style>
			)}

			{show_quotes && (
				<>
					<span
						className="absolute top-6 left-6 md:top-8 md:left-8 text-[120px] md:text-[160px] leading-none select-none pointer-events-none"
						style={{ color: text_color ?? 'currentColor', opacity: 0.25, fontFamily: 'Georgia, serif', lineHeight: 1 }}
						aria-hidden="true"
					>
						&ldquo;
					</span>
					<span
						className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-[120px] md:text-[160px] leading-none select-none pointer-events-none rotate-180 inline-block"
						style={{ color: text_color ?? 'currentColor', opacity: 0.25, fontFamily: 'Georgia, serif', lineHeight: 1 }}
						aria-hidden="true"
					>
						&ldquo;
					</span>
				</>
			)}

			<div
				className={cn(
					'relative mx-auto max-w-[892px] space-y-6',
					alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left',
				)}
			>
				{tagline && (
					<Tagline
						tagline={tagline}
						data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'tagline', mode: 'popover' })}
					/>
				)}
				{headline && (
					<div
						className="rt-headline font-heading font-normal text-4xl md:text-5xl lg:text-h1 leading-tight"
						dangerouslySetInnerHTML={{ __html: headline }}
						data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'headline', mode: 'popover' })}
					/>
				)}
				{content && (
					<Text
						content={content}
						className={proseOverrides}
						data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'content', mode: 'drawer' })}
					/>
				)}
			</div>
		</div>
	);
};

export default RichText;
