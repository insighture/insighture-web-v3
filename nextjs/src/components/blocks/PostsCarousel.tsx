'use client';

import { useState } from 'react';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface CarouselPost {
	id: string;
	title?: string | null;
	slug?: string | null;
	image?: string | null;
	type?: string | null;
	description?: string | null;
}

interface PostsCarouselProps {
	data: {
		id: string;
		headline?: string | null;
		description?: string | null;
		service?: string | null;
		posts?: CarouselPost[];
	};
}

function getReadTime(description?: string | null): number {
	if (!description) return 4;
	const words = description.trim().split(/\s+/).length;
	
return Math.max(1, Math.ceil(words / 200));
}

export default function PostsCarousel({ data }: PostsCarouselProps) {
	const { id, headline, description, posts = [] } = data;
	const [offset, setOffset] = useState(0);

	const pageSize = 3;
	const visible = posts.slice(offset, offset + pageSize);
	const canPrev = offset > 0;
	const canNext = offset + pageSize < posts.length;

	return (
		<section
			className="w-full pt-[80px]"
			data-directus={setAttr({ collection: 'block_posts_carousel', item: id, fields: ['headline', 'description', 'service'], mode: 'popover' })}
		>
			<div className="w-auto lg:px-[120px] flex flex-col gap-[56px]">
				{/* Header */}
				<div className="flex flex-col gap-[24px]">
					<div className="flex items-end justify-between">
						{headline && (
							<h2 className="font-sans font-normal text-[40px] lg:text-[56px] leading-[56px] text-[#1d2939] whitespace-nowrap">
								{headline}
							</h2>
						)}
					</div>
					<div className="flex items-center justify-between gap-[40px]">
						{description && (
							<p className="font-sans font-normal text-[18px] leading-[26px] text-[#1e1e1e] max-w-[839px]">
								{description}
							</p>
						)}
						{/* Prev / Next buttons */}
						<div className="flex gap-[16px] items-center shrink-0">
							<button
								onClick={() => setOffset((o) => Math.max(0, o - pageSize))}
								disabled={!canPrev}
								aria-label="Previous posts"
								className="flex items-center justify-center size-[42px] rounded-full border border-[#1d2939] text-[#1d2939] disabled:opacity-30 hover:bg-[#1d2939] hover:text-white transition-colors"
							>
								<svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
									<path d="M7 1L2 6.5L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
							<button
								onClick={() => setOffset((o) => o + pageSize)}
								disabled={!canNext}
								aria-label="Next posts"
								className="flex items-center justify-center size-[42px] rounded-full border border-[#1d2939] text-[#1d2939] disabled:opacity-30 hover:bg-[#1d2939] hover:text-white transition-colors"
							>
								<svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
									<path d="M1 1L6 6.5L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Cards grid */}
				{visible.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[33px]">
						{visible.map((post) => {
							const readTime = getReadTime(post.description);
							const card = (
								<div className="bg-[#ebf0f2] flex flex-col size-full rounded-[16px] overflow-hidden">
									{/* Image */}
									<div className="relative h-[280px] shrink-0 w-full">
										{post.image ? (
											<DirectusImage
												uuid={post.image}
												alt={post.title ?? ''}
												fill
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 378px"
												className="object-cover"
											/>
										) : (
											<div className="size-full bg-[#d0d5dd]" />
										)}
									</div>
									{/* Body */}
									<div className="flex flex-col flex-1 items-start justify-between px-[16px] py-[24px]">
										<div className="flex flex-col gap-[8px] w-full flex-1">
											{/* Type badge */}
											{post.type && (
												<p className="font-sans font-semibold text-[14px] leading-[24px] text-[#2d3236] tracking-[1.12px] uppercase">
													{post.type}
												</p>
											)}
											{/* Title */}
											<p className="font-sans font-semibold text-[24px] leading-[32px] text-[#15181a]">
												{post.title}
											</p>
										</div>
										{/* Read time */}
										<p className="font-sans italic text-[14px] leading-[22px] text-[#2d3236] tracking-[1.12px] uppercase mt-[16px]">
											{readTime} minute read
										</p>
									</div>
								</div>
							);

							return post.slug ? (
								<Link key={post.id} href={`/blog/${post.slug}`} className="flex group min-h-[560px]">
									<div className="bg-[#ebf0f2] flex flex-col size-full rounded-[16px] overflow-hidden group-hover:shadow-md transition-shadow">
										{/* Image */}
										<div className="relative h-[280px] shrink-0 w-full">
											{post.image ? (
												<DirectusImage
													uuid={post.image}
													alt={post.title ?? ''}
													fill
													sizes="(max-width: 640px) 100vw, 378px"
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="size-full bg-[#d0d5dd]" />
											)}
										</div>
										{/* Body */}
										<div className="flex flex-col flex-1 items-start justify-between px-[16px] py-[24px]">
											<div className="flex flex-col gap-[8px] w-full flex-1">
												{post.type && (
													<p className="font-sans font-semibold text-[14px] leading-[24px] text-[#2d3236] tracking-[1.12px] uppercase">
														{post.type}
													</p>
												)}
												<p className="font-sans font-semibold text-[24px] leading-[32px] text-[#15181a]">
													{post.title}
												</p>
											</div>
											<p className="font-sans italic text-[14px] leading-[22px] text-[#2d3236] tracking-[1.12px] uppercase mt-[16px]">
												{readTime} minute read
											</p>
										</div>
									</div>
								</Link>
							) : (
								<div key={post.id} className="flex min-h-[560px]">
									{card}
								</div>
							);
						})}
					</div>
				)}

				{posts.length === 0 && (
					<p className="text-[#667085] text-[16px]">No posts available.</p>
				)}
			</div>
		</section>
	);
}
