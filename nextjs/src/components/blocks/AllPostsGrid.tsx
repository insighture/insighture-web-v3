'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, Check } from 'lucide-react';
import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';

interface ServiceItem {
	id: string;
	title: string;
}

interface GridPost {
	id: string;
	title?: string | null;
	slug?: string | null;
	image?: string | null;
	description?: string | null;
	type?: string | null;
	service?: ServiceItem | null;
}

interface AllPostsGridProps {
	data: {
		id: string;
		headline?: string | null;
		posts?: GridPost[];
		services?: ServiceItem[];
	};
}

interface FilterOption {
	label: string;
	value: string;
}

interface FilterDropdownProps {
	label: string;
	panelTitle: string;
	options: FilterOption[];
	selected: string[];
	onChange: (values: string[]) => void;
	useHtmlOptionLabels?: boolean;
}

function FilterDropdown({ label, panelTitle, options, selected, onChange, useHtmlOptionLabels }: FilterDropdownProps) {
	const isActive = selected.length > 0;

	function toggle(value: string) {
		if (selected.includes(value)) {
			onChange(selected.filter((v) => v !== value));
		} else {
			onChange([...selected, value]);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'flex items-center justify-between gap-[8px] h-[40px] px-[12px] rounded-[8px] border border-[#dfdfdf] font-sans text-[14px] min-w-[180px] transition-colors focus:outline-none',
						isActive ? 'bg-[#db365a] text-[#f9fafb]' : 'bg-[#f9fafb] text-[#333]',
					)}
				>
					<span className="leading-[16px] whitespace-nowrap">
						{label}
						{isActive && ` (${selected.length})`}
					</span>
					<ChevronDown className="size-[20px] shrink-0" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				sideOffset={6}
				className="p-0 rounded-[12px] border border-[#ced7db] bg-[#f9fafb] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)] overflow-hidden min-w-[220px]"
			>
				<div className="px-[16px] pt-[16px] pb-[8px]">
					<p className="text-[12px] text-[#71717a] font-normal leading-[16px]">{panelTitle}</p>
				</div>
				<div className="flex flex-col pb-[8px] max-h-[324px] overflow-y-auto">
					{options.map((option) => {
						const checked = selected.includes(option.value);
						
return (
							<div
								key={option.value}
								className="flex items-center gap-[12px] px-[16px] py-[8px] cursor-pointer hover:bg-[#f0f4f5]"
								onClick={() => toggle(option.value)}
							>
								<div
									className={cn(
										'size-[20px] shrink-0 rounded-[6px] border flex items-center justify-center transition-colors',
										checked ? 'bg-[#db365a] border-[#db365a]' : 'bg-white border-[#a1a1aa]',
									)}
								>
									{checked && <Check className="size-[14px] text-white" strokeWidth={2.5} />}
								</div>
								{useHtmlOptionLabels ? (
									<span
										className="text-[14px] text-[#333] font-normal leading-[20px]"
										dangerouslySetInnerHTML={{ __html: option.label }}
									/>
								) : (
									<span className="text-[14px] text-[#333] font-normal leading-[20px]">{option.label}</span>
								)}
							</div>
						);
					})}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const TYPE_OPTIONS: FilterOption[] = [
	{ label: 'Insight', value: 'insight' },
	{ label: 'Story', value: 'story' },
	{ label: 'Update', value: 'update' },
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
	const { id, headline, posts = [], services = [] } = data;

	const [typeFilters, setTypeFilters] = useState<string[]>([]);
	const [serviceFilters, setServiceFilters] = useState<string[]>([]);
	const [page, setPage] = useState(1);

	const serviceOptions = useMemo<FilterOption[]>(
		() => services.map((s) => ({ label: s.title, value: s.id })),
		[services],
	);

	const filtered = useMemo(() => {
		return posts.filter((p) => {
			if (typeFilters.length > 0 && (!p.type || !typeFilters.includes(p.type))) return false;
			if (serviceFilters.length > 0 && (!p.service?.id || !serviceFilters.includes(p.service.id))) return false;

			return true;
		});
	}, [posts, typeFilters, serviceFilters]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	const pageNumbers = buildPageNumbers(safePage, totalPages);

	function changeTypeFilters(values: string[]) {
		setTypeFilters(values);
		setPage(1);
	}

	function changeServiceFilters(values: string[]) {
		setServiceFilters(values);
		setPage(1);
	}

	const hasActiveFilters = typeFilters.length > 0 || serviceFilters.length > 0;

	return (
		<section
			className="w-full py-[40px] md:py-[60px] lg:py-[80px] bg-white"
			data-directus={setAttr({ collection: 'block_all_posts', item: id, fields: ['headline'], mode: 'popover' })}
		>
			<Container className="flex flex-col gap-[32px] md:gap-[40px] lg:gap-[56px]">
				{/* Header + Filters */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px]">
					{headline && (
						<h2 className="font-sans font-normal text-[32px] md:text-[40px] lg:text-[64px] leading-[1] text-[#1d2939] shrink-0">
							{headline}
						</h2>
					)}

					{/* Filter bar */}
					<div className="flex flex-wrap gap-[12px] md:gap-[16px] items-center">
						<FilterDropdown
							label="Filter by category"
							panelTitle="Filter category"
							options={TYPE_OPTIONS}
							selected={typeFilters}
							onChange={changeTypeFilters}
						/>

						{serviceOptions.length > 0 && (
							<FilterDropdown
								label="Filter by service pillars"
								panelTitle="Filter service pillars"
								options={serviceOptions}
								selected={serviceFilters}
								onChange={changeServiceFilters}
								useHtmlOptionLabels
							/>
						)}

						{hasActiveFilters && (
							<button
								onClick={() => {
									changeTypeFilters([]);
									changeServiceFilters([]);
								}}
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
									<div className="relative h-[200px] md:h-[280px] shrink-0 w-full">
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
									className="flex group min-h-[420px] md:min-h-[560px]"
								>
									<div className="bg-[#ebf0f2] flex flex-col size-full rounded-[16px] overflow-hidden group-hover:shadow-md transition-shadow">
										<div className="relative h-[200px] md:h-[280px] shrink-0 w-full">
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
								<div key={post.id} className="flex min-h-[420px] md:min-h-[560px]">
									{inner}
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-[#667085] text-[16px]">No posts match your filters.</p>
				)}

				{/* Pagination */}
				{filtered.length > 0 && (
					<div className="flex flex-row justify-center items-center gap-[16px] md:gap-[32px]">
						{/* Prev */}
						<button
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={safePage === 1}
							aria-label="Previous page"
							className="flex items-center justify-center w-[10px] h-[17px] disabled:opacity-30 shrink-0"
						>
							<svg width="10" height="17" viewBox="0 0 10 17" fill="none">
								<path
									d="M8.5 1.5L1.5 8.5L8.5 15.5"
									stroke="#1d2939"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
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
								<path
									d="M1.5 1.5L8.5 8.5L1.5 15.5"
									stroke="#1d2939"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
				)}
			</Container>
		</section>
	);
}
