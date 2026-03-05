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

export default function PlatformCta({ data }: PlatformCtaProps) {
	const { id, title, description, cta_label, cta_url, image } = data;

	return (
		<section
			className="w-full overflow-hidden"
			style={{ background: 'linear-gradient(92.72deg, #ffffff 0.73%, #99dafe 465.82%)' }}
		>
			<div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] py-[64px]">
				<div className="flex items-center gap-[40px]">
					{/* Decorative vertical accent line */}
					<div
						className="hidden lg:block flex-shrink-0 self-stretch w-[2px] rounded-full"
						style={{ background: 'linear-gradient(to bottom, #0182cb, rgba(1,130,203,0.2))' }}
						aria-hidden="true"
					/>

					{/* Content + Image row */}
					<div className="flex flex-col lg:flex-row items-center justify-between gap-[48px] w-full">
						{/* Left: text content */}
						<div className="flex flex-col gap-[40px] items-start lg:max-w-[487px]">
							{title && (
								<div
									className="font-heading font-medium text-[32px] leading-[40px] md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] text-[#1d2939] [&_em]:not-italic [&_em]:italic [&_em]:text-[#0182cb]"
									dangerouslySetInnerHTML={{ __html: title }}
									data-directus={setAttr({
										collection: 'block_platform_cta',
										item: id,
										fields: 'title',
										mode: 'popover',
									})}
								/>
							)}
							{description && (
								<p
									className="font-sans font-normal text-[16px] leading-[24px] text-[#1d2939]"
									data-directus={setAttr({
										collection: 'block_platform_cta',
										item: id,
										fields: 'description',
										mode: 'popover',
									})}
								>
									{description}
								</p>
							)}
							{cta_label && (
								<Link
									href={cta_url ?? '#'}
									className="inline-flex items-center gap-[11px] px-[24px] py-[8px] rounded-[48px] bg-[#0182cb] text-[#fcfcfd] font-heading font-bold text-[16px] leading-[26px] hover:bg-[#016db0] transition-colors whitespace-nowrap"
									data-directus={setAttr({
										collection: 'block_platform_cta',
										item: id,
										fields: ['cta_label', 'cta_url'],
										mode: 'popover',
									})}
								>
									{cta_label}
									<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
										<path
											d="M1 1L6 6L1 11"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</Link>
							)}
						</div>

						{/* Right: image */}
						{image && (
							<div
								className="relative w-full lg:w-[700px] h-[240px] md:h-[306px] flex-shrink-0 rounded-tl-[8px] rounded-bl-[8px] overflow-hidden"
								data-directus={setAttr({
									collection: 'block_platform_cta',
									item: id,
									fields: 'image',
									mode: 'popover',
								})}
							>
								<DirectusImage
									uuid={image}
									alt=""
									fill
									sizes="(max-width: 1024px) 100vw, 700px"
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
				</div>
			</div>
		</section>
	);
}
