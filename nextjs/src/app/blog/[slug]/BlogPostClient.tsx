'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAttr } from '@directus/visual-editing';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import DirectusImage from '@/components/shared/DirectusImage';
import BaseText from '@/components/ui/Text';
import { Separator } from '@/components/ui/separator';
import ShareDialog from '@/components/ui/ShareDialog';
import Link from 'next/link';
import Headline from '@/components/ui/Headline';
import Container from '@/components/ui/container';
import { Post, DirectusUser } from '@/types/directus-schema';
import { Share2 } from 'lucide-react';

interface BlogPostClientProps {
	post: Post;
	relatedPosts: Post[];
	author?: DirectusUser | null;
	authorName: string;
	postUrl: string;
}

function estimateReadingTime(html: string): number {
	const text = html.replace(/<[^>]*>/g, '');
	const words = text.trim().split(/\s+/).length;

	return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
	const d = new Date(dateStr);

	return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function formatPostType(type?: string | null): string {
	if (!type) return 'INSIGHT';

	return type.toUpperCase();
}

export default function BlogPostClient({ post, relatedPosts, author, authorName, postUrl }: BlogPostClientProps) {
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	useEffect(() => {
		if (isVisualEditingEnabled) {
			apply({
				onSaved: () => {
					router.refresh();
				},
			});
		}
	}, [isVisualEditingEnabled, apply, router]);

	const readingTime = post.content ? estimateReadingTime(post.content) : null;

	return (
		<>
			<Container className="pt-20 pb-4">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 text-[14px] font-sans mb-6">
					<Link href="/blog" className="text-[#475467] hover:text-[#1d2939] transition-colors">
						Our Thinking
					</Link>
					<span className="text-[#475467]">&gt;</span>
					<span className="text-[#475467]">{formatPostType(post.type)?.charAt(0) + formatPostType(post.type)?.slice(1).toLowerCase()}</span>
				</nav>

				{/* Meta line: type + reading time + date */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<span className="text-[#0e9384] border font-sans font-medium text-[14px] uppercase tracking-[0.04em] border-l-[3px] border-[#0e9384] px-3 py-1 rounded-md shadow-md shadow-[#0e9384]/20">
							{formatPostType(post.type)}
						</span>
					</div>
					<div className="flex items-center gap-2 text-[#475467] font-sans text-[14px] uppercase tracking-[0.04em]">
						{readingTime && <span>{readingTime} MINUTE READ</span>}
						{readingTime && post.published_at && <span>|</span>}
						{post.published_at && <span>{formatDate(post.published_at)}</span>}
					</div>
				</div>
			</Container>

			{/* Title */}
			<Container className="pb-6">
				<Headline
					as="h1"
					headline={post.title}
					className="!text-[#1d2939] font-heading font-medium text-[32px] md:text-[40px] lg:text-[48px] leading-[1.2]"
					data-directus={setAttr({
						collection: 'posts',
						item: post.id,
						fields: ['title', 'slug'],
						mode: 'popover',
					})}
				/>
			</Container>

			{/* Author + Share row */}
			<Container className="pb-8">
				<div className="flex items-center justify-between">
					<div
						className="flex items-center gap-3"
						data-directus={setAttr({
							collection: 'posts',
							item: post.id,
							fields: ['author'],
							mode: 'popover',
						})}
					>
						{author?.avatar && (
							<DirectusImage
								uuid={typeof author.avatar === 'string' ? author.avatar : author.avatar.id}
								alt={authorName || 'author avatar'}
								className="rounded-full object-cover size-[40px]"
								width={40}
								height={40}
							/>
						)}
						{authorName && (
							<span className="font-sans font-medium text-[16px] text-[#1d2939]">{authorName}</span>
						)}
					</div>
					<ShareDialog title="Share" postUrl={postUrl} postTitle={post.title} />
				</div>
			</Container>

			{/* Featured image */}
			{post.image && (
				<Container className="pb-10">
					<div
						className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg"
						data-directus={setAttr({
							collection: 'posts',
							item: post.id,
							fields: ['image'],
							mode: 'modal',
						})}
					>
						<DirectusImage
							uuid={post.image as string}
							alt={post.title || 'post header image'}
							className="object-cover"
							fill
							sizes="(max-width: 768px) 100vw, 1200px"
						/>
					</div>
				</Container>
			)}

			{/* Article content — single column, centered */}
			<Container className="pb-16">
				<article className="prose prose-lg max-w-none dark:prose-dark">
					<BaseText
						content={post.content || ''}
						data-directus={setAttr({
							collection: 'posts',
							item: post.id,
							fields: ['content'],
							mode: 'drawer',
						})}
					/>
				</article>
			</Container>

			{/* Author card */}
			{author && (authorName || author.description) && (
				<Container className="pb-16">
					<div className="bg-[#f3f5f7] border border-[#ced7db] flex items-center p-5 sm:p-6 md:p-10 rounded-2xl shadow-[4px_4px_14px_0px_rgba(21,24,26,0.16)]">
						<div className="flex flex-col gap-4 sm:gap-6 w-full">
							<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
								<div className="flex items-center gap-3">
									{author.avatar && (
										<DirectusImage
											uuid={typeof author.avatar === 'string' ? author.avatar : author.avatar.id}
											alt={authorName || 'Author'}
											className="rounded-full object-cover size-[64px] sm:size-[80px] md:size-[100px] shrink-0"
											width={100}
											height={100}
										/>
									)}
									<div className="flex flex-col">
										{authorName && (
											<span className="font-sans text-[18px] sm:text-[20px] md:text-[24px] leading-[28px] sm:leading-[32px] text-[#2d3236]">
												{authorName}
											</span>
										)}
										{author.title && (
											<span className="font-sans text-[12px] leading-[20px] text-[#db365a]">
												{author.title}
											</span>
										)}
									</div>
								</div>
								{(author.social_facebook || author.social_twitter || author.social_instagram || author.social_youtube) && (
									<div className="flex items-center gap-2 shrink-0">
										{author.social_facebook && (
											<a href={author.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center size-[36px] rounded-full bg-[#344054] hover:bg-[#1d2939] transition-colors">
												<svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M6.39 18V9.79h2.75l.41-3.2H6.39V4.55c0-.93.26-1.56 1.59-1.56h1.7V.13A22.86 22.86 0 007.18 0C4.66 0 2.96 1.49 2.96 4.23v2.36H.2v3.2h2.76V18h3.43z" fill="#ffffff"/></svg>
											</a>
										)}
										{author.social_twitter && (
											<a href={author.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="flex items-center justify-center size-[36px] rounded-full bg-[#344054] hover:bg-[#1d2939] transition-colors">
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff"/></svg>
											</a>
										)}
										{author.social_instagram && (
											<a href={author.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center size-[36px] rounded-full bg-[#344054] hover:bg-[#1d2939] transition-colors">
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#ffffff"/></svg>
											</a>
										)}
										{author.social_youtube && (
											<a href={author.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex items-center justify-center size-[36px] rounded-full bg-[#344054] hover:bg-[#1d2939] transition-colors">
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#ffffff"/></svg>
											</a>
										)}
									</div>
								)}
							</div>
							{author.description && (
								<p className="font-sans text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#15181a]">
									{author.description}
								</p>
							)}
						</div>
					</div>
				</Container>
			)}

			<Container className="pb-8">
				<div className="flex items-end justify-end">
					<ShareDialog title="Share blog" postUrl={postUrl} postTitle={post.title} />
				</div>
			</Container>

			{/* Related Insights section */}
			{relatedPosts.length > 0 && (
				<section className="py-16 md:py-20">
					<Container>
						<h2 className="font-heading font-medium text-[28px] md:text-[36px] leading-[1.2] text-[#1d2939] mb-10">
							Related Insights
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{relatedPosts.map((relatedPost) => {
								const relReadTime = relatedPost.content
									? estimateReadingTime(relatedPost.content)
									: null;

								return (
									<Link
										key={relatedPost.id}
										href={`/blog/${relatedPost.slug}`}
										className="group flex flex-col bg-[#ebf0f2] rounded-[16px] overflow-hidden"
									>
										{relatedPost.image && (
											<div className="relative w-full h-[280px] overflow-hidden rounded-t-[16px]">
												<DirectusImage
													uuid={relatedPost.image as string}
													alt={relatedPost.title || ''}
													className="object-cover transition-transform duration-300 group-hover:scale-105"
													fill
													sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
												/>
											</div>
										)}
										<div className="flex flex-1 flex-col justify-between px-4 py-6">
											<div className="flex flex-col gap-2 h-[210px]">
												<span className="font-sans font-semibold text-[14px] uppercase tracking-[1.12px] text-[#1d2939]">
													{formatPostType(relatedPost.type)}
												</span>
												<h3 className="font-heading font-semibold text-[24px] leading-[32px] text-[#1e1e1e] group-hover:text-[#0e9384] transition-colors">
													{relatedPost.title}
												</h3>
											</div>
											{relReadTime && (
												<span className="font-open-sans font-normal italic text-[14px] uppercase tracking-[1.12px] text-[#1d2939] mt-6">
													{relReadTime} MINUTE READ
												</span>
											)}
										</div>
									</Link>
								);
							})}
						</div>
					</Container>
				</section>
			)}
		</>
	);
}
