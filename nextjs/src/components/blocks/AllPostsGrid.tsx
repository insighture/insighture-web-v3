'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

interface GridPost {
	id: string;
	title?: string | null;
	slug?: string | null;
	image?: string | null;
	description?: string | null;
	type?: string | null;
	service?: string | null;
}

interface AllPostsGridProps {
	data: {
		id: string;
		headline?: string | null;
		posts?: GridPost[];
	};
}

const TYPE_OPTIONS = [
	{ label: 'All Types', value: '' },
	{ label: 'Insight', value: 'insight' },
	{ label: 'Story', value: 'story' },
	{ label: 'Update', value: 'update' },
];

const SERVICE_OPTIONS = [
	{ label: 'All Services', value: '' },
	{ label: 'Migration & Modernisation', value: 'migration-modernisation' },
	{ label: 'AI/ML', value: 'ai-ml' },
	{ label: 'Product Innovation', value: 'product-innovation' },
	{ label: 'Data', value: 'data' },
	{ label: 'Security', value: 'security' },
	{ label: 'Integrated Ecosystem', value: 'integrated-ecosystem' },
];

const PAGE_SIZE = 9;

function getReadTime(description?: string | null): number {
	if (!description) return 4;
	const words = description.trim().split(/\s+/).length;
	
return Math.max(1, Math.ceil(words / 200));
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: (number | '...')[] = [1];
	if (current > 3) pages.push('...');
	for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
		pages.push(i);
	}
	if (current < total - 2) pages.push('...');
	pages.push(total);
	
return pages;
}

export default function AllPostsGrid({ data }: AllPostsGridProps) {
	const { id, headline, posts = [] } = data;

	const [typeFilter, setTypeFilter] = useState('');
	const [serviceFilter, setServiceFilter] = useState('');
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		return posts.filter((p) => {
			if (typeFilter && p.type !== typeFilter) return false;
			if (serviceFilter && p.service !== serviceFilter) return false;
			
return true;
		});
	}, [posts, typeFilter, serviceFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	const pageNumbers = buildPageNumbers(safePage, totalPages);

	function changeFilter(setter: (v: string) => void, value: string) {
		setter(value);
		setPage(1);
	}

	return (
		<section
			className="w-full py-[80px]"
			data-directus={setAttr({ collection: 'block_all_posts', item: id, fields: ['headline'], mode: 'popover' })}
		>
			<div className="mx-auto max-w-[1200px] px-4 lg:px-8 flex flex-col gap-[80px]">
				{/* Header + Filters */}
				<div className="flex flex-col gap-[40px]">
					{headline && (
						<h2 className="font-sans font-normal text-[40px] lg:text-[64px] leading-[1] text-[#1d2939]">
							{headline}
						</h2>
					)}

					{/* Filter bar */}
					<div className="flex flex-wrap gap-[16px]">
						<div className="relative">
							<select
								value={typeFilter}
								onChange={(e) => changeFilter(setTypeFilter, e.target.value)}
								className="appearance-none bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] pr-[40px] font-sans text-[14px] text-[#1d2939] cursor-pointer hover:border-[#1d2939] transition-colors focus:outline-none focus:border-[#1d2939]"
							>
								{TYPE_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>{o.label}</option>
								))}
							</select>
							<svg className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[#667085]" width="12" height="8" viewBox="0 0 12 8" fill="none">
								<path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>

						<div className="relative">
							<select
								value={serviceFilter}
								onChange={(e) => changeFilter(setServiceFilter, e.target.value)}
								className="appearance-none bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] pr-[40px] font-sans text-[14px] text-[#1d2939] cursor-pointer hover:border-[#1d2939] transition-colors focus:outline-none focus:border-[#1d2939]"
							>
								{SERVICE_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>{o.label}</option>
								))}
							</select>
							<svg className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[#667085]" width="12" height="8" viewBox="0 0 12 8" fill="none">
								<path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>

						{(typeFilter || serviceFilter) && (
							<button
								onClick={() => { changeFilter(setTypeFilter, ''); changeFilter(setServiceFilter, ''); }}
								className="px-[16px] py-[10px] font-sans text-[14px] text-[#667085] hover:text-[#1d2939] transition-colors"
							>
								Clear filters
							</button>
						)}
					</div>
				</div>

				{/* Grid */}
				{visible.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[33px]">
						{visible.map((post) => {
							const readTime = getReadTime(post.description);
							const inner = (
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
							);

							return post.slug ? (
								<Link
									key={post.id}
									href={`/blog/${post.slug}`}
									className="flex group"
								>
									<div className="bg-[#ebf0f2] flex flex-col size-full rounded-[16px] overflow-hidden group-hover:shadow-md transition-shadow">
										<div className="relative h-[280px] shrink-0 w-full">
											{post.image ? (
												<DirectusImage
													uuid={post.image}
													alt={post.title ?? ''}
													fill
													sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 378px"
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="size-full bg-[#d0d5dd]" />
											)}
										</div>
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
								<div key={post.id}>{inner}</div>
							);
						})}
					</div>
				) : (
					<p className="text-[#667085] text-[16px]">No posts match your filters.</p>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center gap-[32px]">
						{/* Prev */}
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={safePage === 1}
							aria-label="Previous page"
							className="flex items-center justify-center w-[10px] h-[17px] disabled:opacity-30 shrink-0"
						>
							<svg width="10" height="17" viewBox="0 0 10 17" fill="none">
								<path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke="#1d2939" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>

						{/* Page numbers */}
						{pageNumbers.map((n, i) =>
							n === '...' ? (
								<span
									key={`ellipsis-${i}`}
									className="font-sans font-semibold text-[14px] text-[#2d3236] tracking-[1.12px] uppercase"
								>
									...
								</span>
							) : safePage === n ? (
								<div
									key={n}
									className="flex items-center justify-center border border-[#ee4065] border-solid rounded-[240px] size-[32px] shrink-0 cursor-pointer"
									onClick={() => setPage(n as number)}
								>
									<span className="font-sans font-semibold text-[14px] text-[#2d3236] tracking-[1.12px] uppercase text-center w-full">
										{n}
									</span>
								</div>
							) : (
								<button
									key={n}
									onClick={() => setPage(n as number)}
									className="font-sans font-semibold text-[14px] text-[#2d3236] tracking-[1.12px] uppercase whitespace-nowrap"
								>
									{n}
								</button>
							),
						)}

						{/* Next */}
						<button
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={safePage === totalPages}
							aria-label="Next page"
							className="flex items-center justify-center w-[10px] h-[17px] disabled:opacity-30 shrink-0"
						>
							<svg width="10" height="17" viewBox="0 0 10 17" fill="none">
								<path d="M1.5 1.5L8.5 8.5L1.5 15.5" stroke="#1d2939" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
