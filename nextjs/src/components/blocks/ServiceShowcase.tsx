'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';
import { setAttr } from '@directus/visual-editing';

// ─── Sub-types ───────────────────────────────────────────────────────────────

interface ShowcaseCard {
	id: string;
	sort?: number | null;
	icon?: string | null;
	title?: string | null;
	description?: string | null;
	link_label?: string | null;
	url?: string | null;
}

interface ShowcaseStat {
	id: string;
	sort?: number | null;
	icon?: string | null;
	value?: string | null;
	label?: string | null;
}

interface ShowcaseProduct {
	id: string;
	sort?: number | null;
	title?: string | null;
	is_highlighted?: boolean | null;
}

interface ShowcaseFeaturedPost {
	id: string;
	title?: string | null;
	slug?: string | null;
	image?: string | null;
}

interface ShowcaseItem {
	id: string;
	sort?: number | null;
	label?: string | null;
	accent_color?: string | null;
	service_name?: string | null;
	service_tagline?: string | null;
	service_description?: string | null;
	key_services?: string[] | null;
	service_image?: string | null;
	expertise_heading?: string | null;
	expertise_heading_emphasis?: string | null;
	cta_type?: 'credentials' | 'product' | null;
	cta_headline?: string | null;
	cta_headline_emphasis?: string | null;
	cta_credentials_image?: string | null;
	product_cta_headline?: string | null;
	product_cta_emphasis?: string | null;
	product_catalogue_image?: string | null;
	featured_post?: ShowcaseFeaturedPost | null;
	cards?: ShowcaseCard[];
	stat_items?: ShowcaseStat[];
	product_items?: ShowcaseProduct[];
}

interface ServiceShowcaseProps {
	data: {
		id: string;
		page_headline?: string | null;
		page_headline_emphasis?: string | null;
		page_description?: string | null;
		items?: ShowcaseItem[];
	};
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function HeadlineWithEmphasis({
	headline,
	emphasis,
	className,
	emphasisClassName,
	emphasisStyle,
}: {
	headline?: string | null;
	emphasis?: string | null;
	className?: string;
	emphasisClassName?: string;
	emphasisStyle?: React.CSSProperties;
}) {
	if (!headline && !emphasis) return null;
	
return (
		<span className={className}>
			{headline}
			{emphasis && (
				<>
					{' '}
					<em className={emphasisClassName} style={emphasisStyle}>{emphasis}</em>
				</>
			)}
		</span>
	);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServiceShowcase({ data }: ServiceShowcaseProps) {
	const { id, page_headline, page_headline_emphasis, page_description, items = [] } = data;
	const sorted = [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const [activeIndex, setActiveIndex] = useState(0);
	const active = sorted[activeIndex];

	return (
		<section
			className="w-full"
			data-directus={setAttr({
				collection: 'block_service_showcase',
				item: id,
				fields: ['page_headline', 'page_headline_emphasis', 'page_description'],
				mode: 'popover',
			})}
		>
			{/* ── Page Header ──────────────────────────────────────────── */}
			<div className="w-full bg-[#0b2d34] py-[80px] lg:py-[100px]">
				<div className="mx-auto max-w-[1200px] px-4 lg:px-8 flex flex-col gap-[32px]">
					{(page_headline || page_headline_emphasis) && (
						<h1 className="font-sans font-normal text-[40px] lg:text-[64px] leading-[1.1] text-[#fcfcfd] not-italic">
							<HeadlineWithEmphasis
								headline={page_headline}
								emphasis={page_headline_emphasis}
								emphasisClassName="italic text-[#ee4065]"
							/>
						</h1>
					)}
					{page_description && (
						<p className="font-sans text-[17px] lg:text-[18px] leading-[28px] text-[#d0d5dd] max-w-[720px]">
							{page_description}
						</p>
					)}

					{/* Service tab navigation */}
					{sorted.length > 0 && (
						<div className="flex flex-wrap gap-[8px] pt-[16px]">
							{sorted.map((item, index) => {
								const isActive = activeIndex === index;
								const accent = item.accent_color || '#ee4065';
								
return (
									<button
										key={item.id}
										onClick={() => setActiveIndex(index)}
										className="px-[20px] py-[10px] rounded-full font-sans font-medium text-[14px] leading-[24px] border transition-all"
										style={{
											backgroundColor: isActive ? accent : 'transparent',
											borderColor: isActive ? accent : 'rgba(255,255,255,0.3)',
											color: isActive ? '#fcfcfd' : 'rgba(255,255,255,0.7)',
										}}
									>
										{item.label}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{/* ── Active Service Panel ──────────────────────────────────── */}
			{active && (
				<div className="w-full bg-white">
					{/* Service Overview */}
					<div className="mx-auto max-w-[1200px] px-4 lg:px-8 py-[80px]">
						<div className="flex flex-col lg:flex-row gap-[64px] items-start">
							{/* Service info */}
							<div className="flex flex-col gap-[32px] flex-1 min-w-0">
								{active.service_tagline && (
									<p
										className="font-sans font-semibold text-[13px] leading-[22px] uppercase tracking-[1.04px]"
										style={{ color: active.accent_color || '#ee4065' }}
									>
										{active.service_tagline}
									</p>
								)}
								{active.service_name && (
									<h2 className="font-sans font-normal text-[32px] lg:text-[48px] leading-[1.15] text-[#1d2939]">
										{active.service_name}
									</h2>
								)}
								{active.service_description && (
									<p className="font-sans text-[17px] lg:text-[18px] leading-[28px] text-[#475467]">
										{active.service_description}
									</p>
								)}
								{active.key_services && active.key_services.length > 0 && (
									<ul className="flex flex-col gap-[12px]">
										{active.key_services.map((service, i) => (
											<li key={i} className="flex items-start gap-[12px]">
												<span
													className="mt-[8px] size-[6px] rounded-full flex-shrink-0"
													style={{ backgroundColor: active.accent_color || '#ee4065' }}
												/>
												<span className="font-sans text-[16px] leading-[26px] text-[#344054]">
													{service}
												</span>
											</li>
										))}
									</ul>
								)}
							</div>

							{/* Service image */}
							{active.service_image && (
								<div className="relative w-full lg:w-[520px] h-[320px] lg:h-[440px] rounded-[16px] overflow-hidden flex-shrink-0">
									<DirectusImage
										uuid={active.service_image}
										alt={active.service_name ?? ''}
										fill
										sizes="(max-width: 1024px) 100vw, 520px"
										className="object-cover"
										priority
									/>
								</div>
							)}
						</div>
					</div>

					{/* ── Expertise Section ──────────────────────────────── */}
					{((active.expertise_heading || active.expertise_heading_emphasis) ||
						(active.cards && active.cards.length > 0) ||
						(active.stat_items && active.stat_items.length > 0)) && (
						<div className="w-full bg-[#f9fafb] py-[80px]">
							<div className="mx-auto max-w-[1200px] px-4 lg:px-8 flex flex-col gap-[56px]">
								{(active.expertise_heading || active.expertise_heading_emphasis) && (
									<h3 className="font-sans font-normal text-[28px] lg:text-[40px] leading-[1.2] text-[#1d2939]">
										<HeadlineWithEmphasis
											headline={active.expertise_heading}
											emphasis={active.expertise_heading_emphasis}
											emphasisClassName="italic"
											emphasisStyle={{ color: active.accent_color || '#ee4065' }}
										/>
									</h3>
								)}

								{/* Cards grid */}
								{active.cards && active.cards.length > 0 && (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
										{[...active.cards]
											.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
											.map((card) => (
												<div
													key={card.id}
													className="flex flex-col gap-[16px] p-[28px] bg-white rounded-[16px] border border-[#e4e7ec]"
												>
													{card.icon && (
														<div
															className="size-[40px] rounded-[10px] flex items-center justify-center"
															style={{ backgroundColor: `${active.accent_color || '#ee4065'}1a` }}
														>
															<span
																className="text-[20px]"
																style={{ color: active.accent_color || '#ee4065' }}
															>
																{card.icon}
															</span>
														</div>
													)}
													{card.title && (
														<h4 className="font-sans font-semibold text-[18px] leading-[26px] text-[#1d2939]">
															{card.title}
														</h4>
													)}
													{card.description && (
														<p className="font-sans text-[15px] leading-[24px] text-[#475467] flex-1">
															{card.description}
														</p>
													)}
													{card.link_label && card.url && (
														<Link
															href={card.url}
															className="inline-flex items-center gap-[6px] font-sans font-semibold text-[14px] leading-[22px] self-start"
															style={{ color: active.accent_color || '#ee4065' }}
														>
															{card.link_label}
															<svg width="6" height="10" viewBox="0 0 7 12" fill="none" aria-hidden="true">
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
											))}
									</div>
								)}

								{/* Stats */}
								{active.stat_items && active.stat_items.length > 0 && (
									<div className="flex flex-wrap gap-[48px]">
										{[...active.stat_items]
											.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
											.map((stat) => (
												<div key={stat.id} className="flex flex-col gap-[4px]">
													{stat.value && (
														<span
															className="font-sans font-bold text-[40px] lg:text-[56px] leading-[1]"
															style={{ color: active.accent_color || '#ee4065' }}
														>
															{stat.value}
														</span>
													)}
													{stat.label && (
														<span className="font-sans text-[15px] leading-[24px] text-[#475467]">
															{stat.label}
														</span>
													)}
												</div>
											))}
									</div>
								)}
							</div>
						</div>
					)}

					{/* ── CTA Section ────────────────────────────────────── */}
					{active.cta_type && (
						<div className="w-full py-[80px]">
							<div className="mx-auto max-w-[1200px] px-4 lg:px-8">
								{active.cta_type === 'credentials' && (
									<div className="flex flex-col lg:flex-row gap-[64px] items-center">
										{active.cta_credentials_image && (
											<div className="relative w-full lg:w-[480px] h-[300px] lg:h-[380px] rounded-[16px] overflow-hidden flex-shrink-0">
												<DirectusImage
													uuid={active.cta_credentials_image}
													alt={active.cta_headline ?? 'Credentials'}
													fill
													sizes="(max-width: 1024px) 100vw, 480px"
													className="object-cover"
												/>
											</div>
										)}
										<div className="flex flex-col gap-[16px] flex-1">
											{(active.cta_headline || active.cta_headline_emphasis) && (
												<h3 className="font-sans font-normal text-[28px] lg:text-[40px] leading-[1.2] text-[#1d2939]">
													<HeadlineWithEmphasis
														headline={active.cta_headline}
														emphasis={active.cta_headline_emphasis}
														emphasisClassName="italic"
														emphasisStyle={{ color: active.accent_color || '#ee4065' }}
													/>
												</h3>
											)}
										</div>
									</div>
								)}

								{active.cta_type === 'product' && (
									<div className="flex flex-col lg:flex-row gap-[64px] items-start">
										<div className="flex flex-col gap-[32px] flex-1">
											{(active.product_cta_headline || active.product_cta_emphasis) && (
												<h3 className="font-sans font-normal text-[28px] lg:text-[40px] leading-[1.2] text-[#1d2939]">
													<HeadlineWithEmphasis
														headline={active.product_cta_headline}
														emphasis={active.product_cta_emphasis}
														emphasisClassName="italic"
														emphasisStyle={{ color: active.accent_color || '#ee4065' }}
													/>
												</h3>
											)}
											{active.product_items && active.product_items.length > 0 && (
												<ul className="flex flex-col gap-[12px]">
													{[...active.product_items]
														.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
														.map((product) => (
															<li
																key={product.id}
																className="flex items-center gap-[12px] py-[12px] border-b border-[#e4e7ec]"
															>
																{product.is_highlighted && (
																	<span
																		className="size-[8px] rounded-full flex-shrink-0"
																		style={{ backgroundColor: active.accent_color || '#ee4065' }}
																	/>
																)}
																<span
																	className="font-sans text-[16px] leading-[26px]"
																	style={{
																		color: product.is_highlighted ? '#1d2939' : '#475467',
																		fontWeight: product.is_highlighted ? 600 : 400,
																	}}
																>
																	{product.title}
																</span>
															</li>
														))}
												</ul>
											)}
										</div>

										{active.product_catalogue_image && (
											<div className="relative w-full lg:w-[480px] h-[320px] lg:h-[420px] rounded-[16px] overflow-hidden flex-shrink-0">
												<DirectusImage
													uuid={active.product_catalogue_image}
													alt={active.product_cta_headline ?? 'Product catalogue'}
													fill
													sizes="(max-width: 1024px) 100vw, 480px"
													className="object-cover"
												/>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					)}

					{/* ── Featured Post ──────────────────────────────────── */}
					{active.featured_post && (
						<div className="w-full bg-[#f9fafb] py-[64px]">
							<div className="mx-auto max-w-[1200px] px-4 lg:px-8">
								<div
									className="flex flex-col sm:flex-row items-center gap-[32px] p-[32px] rounded-[20px] bg-white border border-[#e4e7ec] overflow-hidden"
								>
									{active.featured_post.image && (
										<div className="relative w-full sm:w-[240px] h-[180px] rounded-[12px] overflow-hidden flex-shrink-0">
											<DirectusImage
												uuid={active.featured_post.image}
												alt={active.featured_post.title ?? ''}
												fill
												sizes="(max-width: 640px) 100vw, 240px"
												className="object-cover"
											/>
										</div>
									)}
									<div className="flex flex-col gap-[16px] flex-1 min-w-0">
										<p
											className="font-sans font-semibold text-[12px] leading-[20px] uppercase tracking-[0.96px]"
											style={{ color: active.accent_color || '#ee4065' }}
										>
											Featured Read
										</p>
										{active.featured_post.title && (
											<h4 className="font-sans font-semibold text-[20px] leading-[28px] text-[#1d2939]">
												{active.featured_post.title}
											</h4>
										)}
										{active.featured_post.slug && (
											<Link
												href={`/blog/${active.featured_post.slug}`}
												className="inline-flex items-center gap-[8px] font-sans font-semibold text-[14px] leading-[22px] self-start"
												style={{ color: active.accent_color || '#ee4065' }}
											>
												Read article
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
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</section>
	);
}
