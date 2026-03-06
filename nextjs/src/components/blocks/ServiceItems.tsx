'use client';

import { useState } from 'react';
import { setAttr } from '@directus/visual-editing';
import DirectusImage from '@/components/shared/DirectusImage';
import ExpertiseCards, { type ExpertiseCardsData } from './ExpertiseCards';
import ServiceFeaturedArticle from './ServiceFeaturedArticle';
import ServiceCredentialsCTA, { type ServiceCredentialsCTAData } from './ServiceCredentialsCTA';
import ServiceProductCatalogue, { type ServiceProductCatalogueData } from './ServiceProductCatalogue';

// ─── From block_service_panel ─────────────────────────────────────────────────
interface ServicePanel {
	id: string;
	subtitle?: string | null;
	description?: string | null;
	image?: string | null;
}

// ─── ImageHighlight data shape ─────────────────────────────────────────────────
interface ImageHighlightData {
	id: string;
	tagline?: string | null;
	headline?: string | null;
	cta_label?: string | null;
	cta_url?: string | null;
	image?: string | null;
	image_alt?: string | null;
	background_color?: string | null;
}

// ─── From block_services_item ─────────────────────────────────────────────────
interface ServiceItem {
	id: string;
	sort?: number | null;
	title?: string | null;
	accent_color?: string | null;
	key_services?: string[] | null;
	panel?: ServicePanel[] | null;
	expertise_cards?: ExpertiseCardsData[] | null;
	featured_article?: ImageHighlightData | null;
	cta_type?: 'credentials_cta' | 'product_catalogue' | null;
	credentials_cta?: ServiceCredentialsCTAData | null;
	product_catalogue?: ServiceProductCatalogueData | null;
}

interface ServiceItemsProps {
	data: {
		id: string;
		description?: string | null;
		heading?: string | null;
		items?: ServiceItem[];
	};
}

export default function ServiceItems({ data }: ServiceItemsProps) {
	const { id, description, heading, items = [] } = data;
	const sorted = [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
	const [activeIndex, setActiveIndex] = useState(0);
	const active = sorted[activeIndex];

	const panel = active?.panel?.[0] ?? null;
	const expertiseCards = active?.expertise_cards?.[0] ?? null;
	const featuredArticle = active?.featured_article ?? null;
	const ctaType = active?.cta_type ?? null;
	const credentialsCTA = active?.credentials_cta ?? null;
	const productCatalogue = active?.product_catalogue ?? null;

	return (
		<section
			className="w-full bg-white"
			data-directus={setAttr({
				collection: 'block_services_tab',
				item: id,
				fields: ['description', 'heading'],
				mode: 'popover',
			})}
		>
			<div className="w-auto lg:px-[120px] py-[64px] lg:py-[96px] flex flex-col gap-[56px]">

				{/* ── Section header ───────────────────────────────────────── */}
				{(heading || description) && (
					<div className="flex flex-col gap-[24px] lg:max-w-[649px]">
						{heading && (
							<h2
								className="font-sans font-normal text-[40px] lg:text-[48px] leading-[1.15] text-[#2d3236]"
								dangerouslySetInnerHTML={{ __html: heading }}
							/>
						)}
						{description && (
							<p className="font-sans font-normal text-[18px] leading-[28px] text-[#1e1e1e]">
								{description}
							</p>
						)}
					</div>
				)}

				{/* ── Gray container — wraps tabs + all sub-sections ───────── */}
				{sorted.length > 0 && (
					<div
						className="bg-[#eff1f5] rounded-[16px] p-[24px] flex flex-col gap-[40px]"
						style={{ boxShadow: '1px 2px 8px 0px #ced7db' }}
					>
						{/* Tab navigation */}
						<div
							className="bg-[#f9fafb] border border-[#b0bfc4] rounded-[8px] p-[8px]"
							style={{ boxShadow: '1px 1px 5px 0px rgba(52,64,84,0.08)' }}
						>
							<div className="flex gap-[4px] flex-wrap items-center min-h-[48px]">
								{sorted.map((item, index) => {
									const isActive = activeIndex === index;
									const accent = item.accent_color || '#2ea1b8';

									return (
										<button
											key={item.id}
											onClick={() => setActiveIndex(index)}
											className="flex-1 min-w-fit px-[12px] py-[10px] rounded-[5px] font-sans font-semibold text-[16px] leading-[26px] transition-all whitespace-nowrap"
											style={{
												backgroundColor: isActive ? accent : 'transparent',
												color: isActive ? '#fcfcfd' : '#98a2b3',
												border: isActive ? `1.2px solid ${accent}` : '1.2px solid transparent',
											}}
										>
											{item.title}
										</button>
									);
								})}
							</div>
						</div>

						{/* Content panel */}
						{active && (
							<div className="bg-[#fcfcfd] rounded-[8px] p-[24px] overflow-hidden">
								<div className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch gap-[40px] lg:h-[452px] w-full min-w-0">

									{/* Left column */}
									<div className="flex flex-col justify-between w-full lg:max-w-[50%] lg:min-w-0 lg:shrink-0">
										<div className="flex flex-col gap-[24px]">
											<div className="flex flex-col gap-[24px]">
												{active.title && (
													<h3
														className="font-sans font-semibold text-[32px] leading-[32px]"
														style={{ color: active.accent_color || '#2ea1b8' }}
													>
														{active.title}
													</h3>
												)}
												{panel?.subtitle && (
													<p
														className="font-sans font-medium italic text-[20px] leading-[20px] opacity-60"
														dangerouslySetInnerHTML={{ __html: panel.subtitle }}
													/>
												)}
											</div>
											{panel?.description && (
												<p className="font-sans font-normal text-[16px] leading-[24px] text-[#1e1e1e]">
													{panel.description}
												</p>
											)}
										</div>

										{/* Key services box */}
										{active.key_services && active.key_services.length > 0 && (
											<div className="bg-[#fafafa] border border-[#e5e7eb] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
												<p className="font-sans italic font-semibold text-[18px] leading-[24px] text-[#999c9e]">
													Key Services
												</p>
												<div className="flex gap-[24px] font-sans   italic text-[14px] leading-[22px] text-[#60696e]">
													{(() => {
														const half = Math.ceil(active.key_services!.length / 2);
														const col1 = active.key_services!.slice(0, half);
														const col2 = active.key_services!.slice(half);

														return (
															<>
																<div className="flex flex-col gap-[2px] w-1/2 shrink-0">
																	{col1.map((s, i) => (
																		<span key={i}>• {s}</span>
																	))}
																</div>
																{col2.length > 0 && (
																	<div className="flex flex-col gap-[2px] flex-1">
																		{col2.map((s, i) => (
																			<span key={i}>• {s}</span>
																		))}
																	</div>
																)}
															</>
														);
													})()}
												</div>
											</div>
										)}
									</div>

									{/* Right column: image */}
									{panel?.image && (
										<div className="relative w-full lg:w-1/2 lg:max-w-[50%] lg:min-w-0 lg:min-h-0 min-h-[280px] lg:h-full rounded-[8px] overflow-hidden">
											<DirectusImage
												uuid={panel?.image}
												alt={active.title ?? 'Service Panel Image'}
												fill
												sizes="(max-width: 1024px) 100vw, 50vw"
												className="object-cover"
											/>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Expertise cards — contained inside gray card */}
						{expertiseCards && (
							<ExpertiseCards
								key={active?.id}
								data={expertiseCards}
								accentColor={active?.accent_color}
								contained
							/>
						)}

						{/* Featured article — contained, rounded clipping */}
						{featuredArticle && (
							<div className="overflow-hidden rounded-[8px]">
								<ServiceFeaturedArticle
									key={`fa-${active.id}`}
									data={featuredArticle}
									accentColor={active.accent_color}
									contained
								/>
							</div>
						)}

						{/* CTA panel — credentials */}
						{ctaType === 'credentials_cta' && credentialsCTA && (
							<ServiceCredentialsCTA
								key={`cta-${active.id}`}
								data={credentialsCTA}
								accentColor={active.accent_color}
								contained
							/>
						)}

						{/* CTA panel — product catalogue */}
						{ctaType === 'product_catalogue' && productCatalogue && (
							<ServiceProductCatalogue
								key={`cta-${active.id}`}
								data={productCatalogue}
								accentColor={active.accent_color}
								contained
							/>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
