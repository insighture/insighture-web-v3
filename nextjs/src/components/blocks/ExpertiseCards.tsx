'use client';

import { useState } from 'react';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

const CARDS_PER_PAGE = 3;

export interface ExpertiseCardItem {
	id: string;
	sort?: number | null;
	icon?: string | null;
	title?: string | null;
	description?: string | null;
	link_label?: string | null;
	url?: string | null;
}

export interface ExpertiseCardsData {
	id: string;
	heading?: string | null;
	cards?: ExpertiseCardItem[];
}

interface ExpertiseCardsProps {
	data: ExpertiseCardsData;
	accentColor?: string | null;
	/** When true, renders without the outer <section> and max-w container (used inside ServiceItems gray card) */
	contained?: boolean;
}

export default function ExpertiseCards({ data, accentColor, contained }: ExpertiseCardsProps) {
	const {
		id,
		heading,
		cards = [],
	} = data;

	const accent = accentColor || '#ee4065';

	const sorted = [...cards].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const isCarousel = sorted.length > CARDS_PER_PAGE;
	const totalPages = Math.ceil(sorted.length / CARDS_PER_PAGE);
	const [page, setPage] = useState(0);

	const visible = isCarousel
		? sorted.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
		: sorted;

	const hasHeading = heading ;

	const inner = (
		<div
			className="flex flex-col gap-[40px]"
			data-directus={setAttr({
				collection: 'block_expertise_cards',
				item: id,
				fields: ['heading', 'heading_emphasis', 'heading_suffix'],
				mode: 'popover',
			})}
		>
			{/* Heading */}
			{hasHeading && (
				<h2 className="font-sans font-normal text-[32px] leading-[40px] text-[#1d2939]" dangerouslySetInnerHTML={{ __html: heading }} />
			)}

			{sorted.length > 0 && (
				<div className="flex flex-col gap-[16px]">
					{/* Cards grid — 3 visible at a time; min-h-[342px] keeps all cards the same height */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
						{visible.map((card) => (
							<div
								key={card.id}
								className="bg-[#fcfcfd] rounded-[8px] p-[20px] flex flex-col justify-between gap-[24px] min-h-[342px]"
								data-directus={setAttr({
									collection: 'block_expertise_cards_items',
									item: card.id,
									fields: ['icon', 'title', 'description', 'link_label', 'url'],
									mode: 'popover',
								})}
							>
								{/* Icon + text */}
								<div className="flex flex-col gap-[24px]">
									{card.icon && (
										<div className="relative size-[48px] shrink-0">
											<DirectusImage
												uuid={card.icon}
												alt=""
												fill
												sizes="48px"
												className="object-contain"
											/>
										</div>
									)}
									<div className="flex flex-col gap-[16px]">
										{card.title && (
											<h3 className="font-sans font-semibold text-[24px] leading-[32px] text-[#1d2939]">
												{card.title}
											</h3>
										)}
										{card.description && (
											<p className="font-sans font-normal text-[16px] leading-[22px] text-[#1d2939]">
												{card.description}
											</p>
										)}
									</div>
								</div>

								{/* CTA link */}
								{card.link_label && card.url && (
									<Link
										href={card.url}
										className="inline-flex items-center gap-[4px] font-sans font-semibold text-[14px] leading-[26px] self-start"
										style={{ color: accent }}
									>
										{card.link_label}
										<svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											aria-hidden="true"
										>
											<path
												d="M3 8H13M13 8L9 4M13 8L9 12"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</Link>
								)}
							</div>
						))}
					</div>

					{/* Carousel navigation — dots left, prev/next arrows right, on the card section row */}
					{isCarousel && (
						<div className="flex items-center justify-between">
							{/* Page dots */}
							<div className="flex items-center gap-[8px]">
								{Array.from({ length: totalPages }).map((_, i) => (
									<button
										key={i}
										onClick={() => setPage(i)}
										aria-label={`Go to page ${i + 1}`}
										className="rounded-full transition-all"
										style={{
											width: i === page ? '24px' : '8px',
											height: '8px',
											backgroundColor: i === page ? accent : '#d0d5dd',
										}}
									/>
								))}
							</div>

							{/* Prev / Next arrows */}
							<div className="flex items-center gap-[8px]">
								<button
									onClick={() => setPage((p) => Math.max(0, p - 1))}
									disabled={page === 0}
									aria-label="Previous"
									className="size-[40px] rounded-full border border-[#e4e7ec] flex items-center justify-center transition-all disabled:opacity-30"
									style={{ color: accent }}
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
										<path
											d="M10 12L6 8L10 4"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
									disabled={page === totalPages - 1}
									aria-label="Next"
									className="size-[40px] rounded-full border border-[#e4e7ec] flex items-center justify-center transition-all disabled:opacity-30"
									style={{ color: accent }}
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
										<path
											d="M6 4L10 8L6 12"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);

	if (contained) {
		return inner;
	}

	return (
		<section className="w-full bg-white">
			<div className="mx-auto max-w-[1200px] px-4 lg:px-8 py-[40px]">
				{inner}
			</div>
		</section>
	);
}
