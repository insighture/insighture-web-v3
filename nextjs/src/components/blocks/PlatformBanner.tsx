'use client';

import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface PlatformCtaProps {
	data: {
		id: string;
		title?: string | null;
		description?: string | null;
		cta_label?: string | null;
		cta_url?: string | null;
		image?: string | null;
	};
}

const ctaChevron = (
	<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
		<path d="M1 1L6 6L1 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export default function PlatformBanner({ data }: PlatformCtaProps) {
	const { id, title, description, cta_label, cta_url, image } = data;

	return (
		<section
			className="w-full overflow-hidden"
			style={{ background: 'linear-gradient(92.72deg, #ffffff 0.73%, #99dafe 465.82%)' }}
		>
			{/* ── Mobile layout (< md) ── */}
			<div className="flex flex-col md:hidden px-6 py-10 gap-4">
				<div className="flex flex-col gap-6">
					{title && (
						<div
							className="font-heading font-medium text-[22px] leading-[28px] text-[#1d2939]"
							dangerouslySetInnerHTML={{ __html: title }}
							
						/>
					)}
					{description && (
						<p
							className="font-sans font-normal text-[16px] leading-[24px] text-[#1d2939]"
							
						>
							{description}
						</p>
					)}
				</div>
				<div className="flex flex-col gap-6">
					{image && (
						<div
							className="w-full h-[180px] rounded-[8px] overflow-hidden relative"
							
						>
							<DirectusImage uuid={image} alt="" fill sizes="100vw" className="object-cover" />
							<div
								className="absolute inset-0 pointer-events-none"
								style={{
									background:
										'linear-gradient(to bottom, rgba(247,247,247,0) 29.66%, rgba(247,247,247,0.6) 100%)',
								}}
							/>
						</div>
					)}
					{cta_label && (
						<Link
							href={cta_url ?? '#'}
							className="inline-flex items-center gap-[11px] px-[12px] py-[8px] h-[32px] rounded-[24px] bg-[#0182cb] text-[#fcfcfd] visited:text-[#fcfcfd] hover:text-[#fcfcfd] focus:text-[#fcfcfd] active:text-[#fcfcfd] font-heading font-bold text-[12px] leading-[26px] hover:bg-[#016db0] transition-colors whitespace-nowrap self-start"
						>
							{cta_label}
							{ctaChevron}
						</Link>
					)}
				</div>
			</div>

			{/* ── Desktop layout (md+) ── */}
			<div className="hidden md:flex items-center py-[64px]">
				{/* Left: accent line + text content */}
				<div className="flex items-stretch gap-8 flex-1 px-8 lg:pl-[120px] lg:pr-[80px]">
					{/* Blue vertical accent line */}
					<div
						className="w-[3px] shrink-0 rounded-full"
						style={{ background: 'linear-gradient(to bottom, #0182cb, rgba(1,130,203,0.2))' }}
						aria-hidden="true"
					/>

					<div className="flex flex-col gap-[40px] items-start max-w-[487px]">
						{title && (
							<div
								className="font-heading font-medium text-[32px] leading-[40px] lg:text-[48px] lg:leading-[56px] text-[#1d2939]"
								dangerouslySetInnerHTML={{ __html: title }}
								
							/>
						)}
						{description && (
							<p
								className="font-sans font-normal text-[16px] leading-[24px] text-[#1d2939]"
								
							>
								{description}
							</p>
						)}
						{cta_label && (
							<Link
								href={cta_url ?? '#'}
								className="inline-flex items-center gap-[11px] px-[24px] py-[8px] rounded-[48px] bg-[#0182cb] text-[#fcfcfd] visited:text-[#fcfcfd] hover:text-[#fcfcfd] focus:text-[#fcfcfd] active:text-[#fcfcfd] font-heading font-bold text-[16px] leading-[26px] hover:bg-[#016db0] transition-colors whitespace-nowrap"
							>
								{cta_label}
								{ctaChevron}
							</Link>
						)}
					</div>
				</div>

				{/* Right: image — flush to right edge, left-side rounded corners only */}
				{image && (
					<div
						className="shrink-0 w-[55%] lg:w-[700px] h-[240px] md:h-[306px] rounded-l-[8px] overflow-hidden relative"
						
					>
						<DirectusImage
							uuid={image}
							alt=""
							fill
							sizes="(max-width: 1024px) 55vw, 700px"
							className="object-cover"
						/>
						{/* Bottom gradient overlay */}
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								background: 'linear-gradient(to bottom, rgba(247,247,247,0) 29.66%, rgba(247,247,247,0.6) 100%)',
							}}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
