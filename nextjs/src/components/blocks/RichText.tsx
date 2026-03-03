'use client';

import { useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Tagline from '@/components/ui/Tagline';
import Text from '@/components/ui/Text';
import { setAttr } from '@directus/visual-editing';

interface RichTextProps {
	data: {
		id: string;
		tagline?: string;
		headline?: string;
		content?: string;
		alignment?: 'left' | 'center' | 'right';
		background_color?: string | null;
		text_color?: string | null;
		emphasis_color?: string | null;
		show_quotes?: boolean | null;
	};
	className?: string;
}

const RichText = ({ data, className }: RichTextProps) => {
	const { id, tagline, headline, content, alignment = 'left', background_color, text_color, emphasis_color, show_quotes } = data;
	const scopeId = useId().replace(/:/g, '');
	const hasBackground = !!background_color;
	const router = useRouter();

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

	return (
		<div
			id={`rt-${scopeId}`}
			className={cn(
				'relative w-full',
				hasBackground ? 'px-16 py-16 md:px-24 md:py-20' : '',
				className,
			)}
			style={{
				color: text_color ?? undefined,
			}}
		>
			{/* Scoped styles: emphasis color + quote text sizing */}
			{(emphasis_color || hasBackground) && (
				<style>{[
					emphasis_color ? `#rt-${scopeId} em, #rt-${scopeId} .rt-headline em { color: ${emphasis_color}; font-style: italic; }` : '',
					hasBackground ? `#rt-${scopeId} .prose p { font-size: 40px; line-height: 56px; font-weight: 500; }` : '',
				].join(' ')}</style>
			)}

			{/* Decorative quote marks */}
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

			{/* Content */}
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
						data-directus={setAttr({ collection: 'block_richtext', item: id, fields: 'content', mode: 'drawer' })}
					/>
				)}
			</div>
		</div>
	);
};

export default RichText;
