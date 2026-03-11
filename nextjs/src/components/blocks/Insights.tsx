'use client';

import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface InsightsPost {
	id: string;
	title?: string | null;
	description?: string | null;
	slug?: string | null;
	image?: string | null;
	published_at?: string | null;
}

interface InsightsProps {
	data: {
		id: string;
		headline?: string | null;
		headline_emphasis?: string | null;
		tagline?: string | null;
		posts?: InsightsPost[];
	};
}

export default function Insights({ data }: InsightsProps) {
	const { id, headline, headline_emphasis, tagline, posts = [] } = data;

	const featured = posts[0] ?? null;
	const sidebarPosts = posts.slice(1);

	return (
		<section
			className="w-full bg-[#f9fafb]"
			data-directus={setAttr({ collection: 'block_insights', item: id, fields: ['headline', 'headline_emphasis', 'tagline'], mode: 'popover' })}
		>
			{/* Centered heading */}
			<Container className="pt-[48px] lg:pt-[80px] pb-0 text-center">
				<h2 className="font-heading font-semibold text-[32px] leading-[38px] md:text-[40px] md:leading-[44px] lg:text-[48px] lg:leading-[48px] text-[#1d2939]">
					{headline && <span dangerouslySetInnerHTML={{ __html: headline }} />}
					{headline_emphasis && (
						<span className="italic text-[#ee4065]" dangerouslySetInnerHTML={{ __html: headline_emphasis }} />
					)}
				</h2>
			</Container>

			{/* Main content row — stacks on mobile, side-by-side on desktop */}
			<div className="mt-[40px] lg:mt-[64px] flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-0 overflow-hidden">

				{/* Left column on desktop: featured post + editorial text */}
				<div className="w-full lg:w-[52%] shrink-0">
					{/* Featured post image — full-width on mobile, bleeds to left edge on desktop */}
					{featured && (
						<Link
							href={`/blog/${featured.slug}`}
							className="group relative mx-4 lg:mx-0 h-[240px] sm:h-[320px] lg:h-[500px] w-[calc(100%-32px)] lg:w-full rounded-[16px] lg:rounded-l-none lg:rounded-r-[16px] overflow-hidden shadow-sm block"
						>
							{featured.image ? (
								<DirectusImage
									uuid={featured.image}
									alt={featured.title ?? ''}
									fill
									sizes="(max-width: 1024px) calc(100vw - 32px), 52vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									priority
								/>
							) : (
								<div className="size-full bg-[#d0d5dd]" />
							)}
						</Link>
					)}

					{/* Bottom editorial text — shown right after featured post on mobile, at bottom on desktop */}
					{(featured?.title || featured?.description) && (
						<div className="mt-[24px] lg:hidden px-4 flex flex-col gap-[16px]">
							{featured.title && (
								<p className="font-sans font-normal text-[22px] leading-[32px] text-[#1d2939]">
									{featured.title}
								</p>
							)}
							{featured.description && (
								<p className="font-sans font-normal text-[15px] leading-[24px] text-[#1d2939]">
									{featured.description}
								</p>
							)}
						</div>
					)}
				</div>

				{/* Right: tagline + sidebar post list */}
				<div className="flex flex-col gap-[24px] px-4 lg:px-[60px] flex-1 min-w-0 lg:pb-0 pb-20">
					{tagline && (
						<div className="font-heading font-semibold text-[14px] lg:text-[16px] leading-[26px] text-[#1d2939] uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: tagline }} />
					)}

					<div className="flex flex-col gap-[21px]">
						{sidebarPosts.map((post) => (
							<Link
								key={post.id}
								href={`/blog/${post.slug}`}
								className="group flex gap-[24px] items-center"
							>
								{/* Thumbnail */}
								<div className="relative shrink-0 w-[140px] h-[96px] sm:w-[180px] sm:h-[116px] lg:w-[209px] lg:h-[136px] rounded-[16px] overflow-hidden shadow-sm">
									{post.image ? (
										<DirectusImage
											uuid={post.image}
											alt={post.title ?? ''}
											fill
											sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 209px"
											className="object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									) : (
										<div className="size-full bg-[#d0d5dd]" />
									)}
								</div>

								{/* Title + chevron */}
								<div className="flex items-center gap-[12px] min-w-0">
									<p className="font-heading font-medium text-[14px] lg:text-[16px] leading-[22px] lg:leading-[26px] text-[#1d2939] group-hover:text-[#ee4065] transition-colors">
										{post.title}
									</p>
									<svg
										width="7"
										height="12"
										viewBox="0 0 7 12"
										fill="none"
										className="shrink-0 text-[#ee4065]"
										aria-hidden="true"
									>
										<path d="M1 1L6 6L1 11" stroke="#ee4065" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* Bottom editorial text — desktop only (hidden on mobile since shown above) */}
			{(featured?.title || featured?.description) && (
				<Container className="hidden lg:flex mt-[32px] pb-[80px] flex-col gap-[16px]">
					{featured.title && (
						<p className="font-sans font-normal text-[32px] leading-[48px] text-[#1d2939]">
							{featured.title}
						</p>
					)}
					{featured.description && (
						<p className="font-sans font-normal text-[16px] leading-[26px] text-[#1d2939] max-w-[665px]">
							{featured.description}
						</p>
					)}
				</Container>
			)}
		</section>
	);
}
