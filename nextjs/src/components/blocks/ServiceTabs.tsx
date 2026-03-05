'use client';

import { useState } from 'react';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface ServiceTabItem {
	id: string;
	sort?: number | null;
	label?: string | null;
	accent_color?: string | null;
	headline?: string | null;
	description?: string | null;
	image?: string | null;
	link_label?: string | null;
	url?: string | null;
}

interface ServiceTabsProps {
	data: {
		id: string;
		tagline?: string | null;
		headline?: string | null;
		items?: ServiceTabItem[];
	};
}

export default function ServiceTabs({ data }: ServiceTabsProps) {
	const { id, tagline, headline, items = [] } = data;
	const sorted = [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const [activeIndex, setActiveIndex] = useState(0);
	const active = sorted[activeIndex];

	return (
		<section
			className="w-full py-[80px] bg-white"
			data-directus={setAttr({
				collection: 'block_service_tabs',
				item: id,
				fields: ['tagline', 'headline'],
				mode: 'popover',
			})}
		>
			<div className="mx-auto max-w-[1200px] px-4 lg:px-8 flex flex-col gap-[56px]">
				{/* Header */}
				<div className="flex flex-col gap-[12px]">
					{tagline && (
						<p className="font-sans font-semibold text-[14px] leading-[24px] uppercase tracking-[1.12px] text-[#667085]">
							{tagline}
						</p>
					)}
					{headline && (
						<h2 className="font-sans font-normal text-[40px] lg:text-[56px] leading-[1.1] text-[#1d2939]">
							{headline}
						</h2>
					)}
				</div>

				{sorted.length > 0 && (
					<div className="flex flex-col gap-[48px]">
						{/* Tab buttons */}
						<div className="flex flex-wrap gap-[8px] border-b border-[#e4e7ec]">
							{sorted.map((item, index) => {
								const isActive = activeIndex === index;
								const accent = item.accent_color || '#1d2939';
								
return (
									<button
										key={item.id}
										onClick={() => setActiveIndex(index)}
										className="relative px-[20px] py-[12px] font-sans font-medium text-[15px] leading-[24px] transition-colors"
										style={{
											color: isActive ? accent : '#667085',
											borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent',
											marginBottom: '-1px',
										}}
									>
										{item.label}
									</button>
								);
							})}
						</div>

						{/* Content panel */}
						{active && (
							<div className="flex flex-col lg:flex-row gap-[48px] lg:gap-[80px] items-start lg:items-center">
								{/* Text content */}
								<div className="flex flex-col gap-[24px] flex-1 min-w-0">
									{active.headline && (
										<h3 className="font-sans font-normal text-[28px] lg:text-[40px] leading-[1.2] text-[#1d2939]">
											{active.headline}
										</h3>
									)}
									{active.description && (
										<p className="font-sans text-[17px] lg:text-[18px] leading-[28px] text-[#475467]">
											{active.description}
										</p>
									)}
									{active.link_label && active.url && (
										<Link
											href={active.url}
											className="inline-flex items-center gap-[8px] font-sans font-semibold text-[16px] leading-[24px] self-start"
											style={{ color: active.accent_color || '#1d2939' }}
										>
											{active.link_label}
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

								{/* Image */}
								{active.image && (
									<div className="relative w-full lg:w-[520px] h-[280px] lg:h-[380px] rounded-[16px] overflow-hidden flex-shrink-0">
										<DirectusImage
											uuid={active.image}
											alt={active.headline ?? ''}
											fill
											sizes="(max-width: 1024px) 100vw, 520px"
											className="object-cover"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
