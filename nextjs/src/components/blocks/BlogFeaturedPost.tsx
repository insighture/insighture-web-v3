'use client';

import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface PostItem {
	id: string;
	title?: string | null;
	slug?: string | null;
	type?: 'insight' | 'story' | 'update' | null;
}

interface BlogFeaturedPostProps {
	data: {
		id: string;
		tagline?: string | null;
		background_color?: string | null;
		image?: string | null;
		special_post?: PostItem | null;
		special_post_title?: string | null;
		recommended_posts?: PostItem[] | null;
	};
}

export default function BlogFeaturedPost({ data }: BlogFeaturedPostProps) {
	const { id, tagline, background_color, image, special_post, special_post_title, recommended_posts } = data;
	if (!special_post) return null;

	const bg = background_color || '#0b2d34';

	return (
		<section
			className="w-full overflow-hidden"
			style={{ backgroundColor: bg }}
			data-directus={setAttr({
				collection: 'block_featured_post',
				item: id,
				fields: ['tagline', 'background_color', 'image', 'special_post', 'special_post_title', 'recommended_posts'],
				mode: 'popover',
			})}
		>
			<div className="flex flex-col lg:flex-row items-center pb-10 md:pb-16 gap-[40px] md:gap-[60px] lg:gap-[130px]">
				{/* Left column */}
				<div className="lg:w-1/2">
					<div className="flex flex-col gap-6 md:gap-10 items-start w-full lg:flex-1 lg:min-w-0">
						{/* Image */}
						{image && (
							<div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[451px] rounded-br-[16px] overflow-hidden">
								<DirectusImage
									uuid={image}
									alt={'Featured Post Image'}
									fill
									sizes="(max-width: 1024px) 100vw, calc(100vw - 774px)"
									className="object-cover"
									priority
								/>
							</div>
						)}

						{/* Text */}
						{special_post && (
							<Container className="flex flex-col gap-[32px] md:gap-[56px] lg:pl-[120px]">
								<div className="flex flex-col gap-4 items-start w-full lg:max-w-[556px]">
									{special_post.type && (
										<p className="font-sans font-normal text-[14px] md:text-[16px] leading-[22px] text-[#fcfcfd] tracking-[0.96px] uppercase w-full">
											{special_post.type}
										</p>
									)}

									{(special_post_title || special_post.title) && (
										<p
											className="font-sans font-medium text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-[#fcfcfd]"
											dangerouslySetInnerHTML={{ __html: (special_post_title || special_post.title)! }}
										></p>
									)}

									{special_post.slug && (
										<Link
											href={`/blog/${special_post.slug}`}
											className="inline-flex items-center gap-[11px] bg-[#ee4065] px-6 py-2 rounded-[48px] text-[14px] md:text-[16px] font-bold leading-[26px] text-[#fcfcfd] hover:bg-[#d93a5a] transition-colors whitespace-nowrap mt-4"
										>
											Read{' '}
											{special_post.type === 'story' ? 'story' : special_post.type === 'insight' ? 'insight' : 'more'}
											<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
												<path
													d="M1 1L6 6L1 11"
													stroke="#fcfcfd"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</Link>
									)}
								</div>
							</Container>
						)}
					</div>
				</div>

				{/* Right column */}
				{recommended_posts && recommended_posts.length > 0 && (
					<div className="lg:w-1/2">
						<div className="flex flex-col gap-6 md:gap-10 items-start pt-0 lg:pt-12 pb-6 md:pb-10 w-full lg:flex-none lg:w-[620px] px-4 md:px-8 lg:px-0">
							{tagline && (
								<p className="font-sans font-semibold text-[14px] md:text-[16px] leading-[24px] text-[#d0d5dd] uppercase tracking-[0.08em]">
									{tagline}
								</p>
							)}

							<div className="flex flex-col gap-6 md:gap-8 items-start w-full">
								{recommended_posts.map((recPost, index) => (
									<div key={recPost.id} className="flex flex-col gap-6 md:gap-8 w-full">
										<div className="flex flex-col gap-2 items-start text-[#fcfcfd] w-full">
											{recPost.type && (
												<p className="font-sans font-normal text-[12px] leading-[22px] tracking-[0.96px] uppercase w-full">
													{recPost.type}
												</p>
											)}
											{recPost.slug ? (
												<Link
													href={`/blog/${recPost.slug}`}
													className="font-sans font-semibold text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-[#fcfcfd] hover:text-[#d0d5dd] transition-colors w-full"
												>
													{recPost.title}
												</Link>
											) : (
												<p className="font-sans font-semibold text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] w-full">
													{recPost.title}
												</p>
											)}
										</div>
										{index < recommended_posts.length - 1 && <div className="w-full h-px bg-[#d0d5dd]/20" />}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
