'use client';

import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface ServiceFeaturedArticleProps {
	data: {
		id: string;
		tagline?: string | null;
		headline?: string | null;
		cta_label?: string | null;
		cta_url?: string | null;
		image?: string | null;
		image_alt?: string | null;
		background_color?: string | null;
	};
	accentColor?: string | null;
	/** When true, renders without outer <section> wrapper (used inside ServiceItems gray card) */
	contained?: boolean;
}

export default function ServiceFeaturedArticle({ data, accentColor, contained }: ServiceFeaturedArticleProps) {
	const { id, tagline, headline, cta_label, cta_url, image, image_alt, background_color } = data;
	const bg = accentColor || background_color || '#0fa2bf';
	const headlinePlain = headline ? headline.replace(/<[^>]*>/g, '') : '';

	const ctaButton =
		cta_label && cta_url ? (
			<Link
				href={cta_url}
				className="inline-flex items-center gap-[11px] bg-[#fcfcfd] px-6 py-2 rounded-full self-start"
			>
				<span className="font-bold text-[16px] leading-[26px] whitespace-nowrap" style={{ color: bg }}>
					{cta_label}
				</span>
				<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
					<path
						d="M1 1L6 6L1 11"
						stroke={bg}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Link>
		) : null;

	const desktopContent = (
		<div className="hidden lg:block">
			<div className="relative" style={{ height: '624px' }}>
				{/* Dark inner card — 56px from top/bottom, 64px from left/right */}
				<div
					className="absolute rounded-2xl"
					style={{
						top: '56px',
						bottom: '56px',
						left: '64px',
						right: '64px',
						backgroundColor: 'rgba(21, 24, 26, 0.16)',
					}}
				/>

				{/* Content row — starts at 112px from top */}
				<div
					className="absolute inset-x-0 flex items-start gap-10"
					style={{ top: '112px' }}
				>
					{/* Image — bleeds from left-0; right corners rounded */}
					{image && (
						<div
							className="relative flex-shrink-0 rounded-r-lg overflow-hidden"
							style={{ width: '560px', height: '400px' }}
						>
							<DirectusImage
								uuid={image}
								alt={image_alt || headlinePlain || ''}
								fill
								sizes="560px"
								className="object-cover"
								priority
							/>
						</div>
					)}

					{/* Text content */}
					<div
						className="flex-1 flex flex-col justify-between pr-16"
						style={{ height: '368px', paddingTop: '24px' }}
					>
						<div className="flex flex-col gap-10">
							{tagline && (
								<p className="font-semibold text-base leading-6 text-[#fcfcfd] uppercase tracking-[1.28px]">
									{tagline}
								</p>
							)}
							{headline && (
								<div className="font-bold text-[36px] leading-[48px] text-[#fcfcfd] [&>p]:m-0" dangerouslySetInnerHTML={{ __html: headline }} />
							)}
						</div>
						{ctaButton}
					</div>
				</div>
			</div>
		</div>
	);

	const mobileContent = (
		<div className="lg:hidden px-4 py-10">
			<div
				className="rounded-2xl overflow-hidden"
				style={{ backgroundColor: 'rgba(21, 24, 26, 0.16)' }}
			>
				{image && (
					<div className="relative w-full h-[220px] overflow-hidden">
						<DirectusImage
							uuid={image}
							alt={image_alt || headlinePlain || ''}
							fill
							sizes="100vw"
							className="object-cover"
						/>
					</div>
				)}
				<div className="flex flex-col gap-8 p-6 sm:p-8">
					{tagline && (
						<p className="font-semibold text-sm leading-6 text-[#fcfcfd] uppercase tracking-[1.28px]">
							{tagline}
						</p>
					)}
					{headline && (
						<div className="font-bold text-3xl leading-9 text-[#fcfcfd] [&>p]:m-0" dangerouslySetInnerHTML={{ __html: headline }} />
					)}
					{ctaButton}
				</div>
			</div>
		</div>
	);

	const directusAttr = setAttr({
		collection: 'block_service_featured_article',
		item: id,
		fields: ['tagline', 'headline', 'cta_label', 'cta_url', 'image', 'background_color'],
		mode: 'popover',
	});

	if (contained) {
		return (
			<div
				className="w-full overflow-hidden"
				style={{ backgroundColor: bg }}
				data-directus={directusAttr}
			>
				{mobileContent}
				{desktopContent}
			</div>
		);
	}

	return (
		<section
			className="w-full overflow-hidden"
			style={{ backgroundColor: bg }}
			data-directus={directusAttr}
		>
			{mobileContent}
			<div className="max-w-[1440px] mx-auto">
				{desktopContent}
			</div>
		</section>
	);
}
