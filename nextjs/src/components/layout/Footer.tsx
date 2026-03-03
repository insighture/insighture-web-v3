'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef } from 'react';

interface SocialLink {
	service: string;
	url: string;
}

interface NavigationChild {
	id: string;
	title: string;
	url?: string | null;
	page?: { permalink?: string | null };
}

interface NavigationItem {
	id: string;
	title: string;
	url?: string | null;
	page?: { permalink?: string | null };
	children?: NavigationChild[];
}

interface FooterProps {
	navigation: { items: NavigationItem[] };
	globals: {
		logo?: string | null;
		logo_dark_mode?: string | null;
		description?: string | null;
		social_links?: SocialLink[];
	};
}

const CTA_DECORATIVE = '/images/87f7c1d4191fff0fd15ede7ab007d0850c3957a1.svg';
const ISO_BADGE = '/icons/fce179918d852a9c853ec286fd28ee61c314c07c.svg';
const AWS_BADGE = '/icons/09a5115de1f39d8de30ff1f6d2065773a2387789.svg';

const Footer = forwardRef<HTMLElement, FooterProps>(({ navigation, globals }, ref) => {
	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	const logoUrl = globals?.logo_dark_mode
		? `${directusURL}/assets/${globals.logo_dark_mode}`
		: globals?.logo
			? `${directusURL}/assets/${globals.logo}`
			: '/images/logo.svg';

	const navItems = navigation?.items ?? [];

	return (
		<footer ref={ref}>
			{/* ── CTA Banner ──────────────────────────────────────────────── */}
			<div
				className="relative w-full overflow-hidden"
				style={{
					backgroundImage:
						'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(100.06deg, rgb(238, 64, 101) 9.8704%, rgb(150, 33, 59) 102.65%)',
				}}
			>
				{/* Decorative vector */}
				<div
					className="pointer-events-none absolute flex items-center justify-center"
					style={{
						left: 'calc(50% + 270px)',
						top: '-220px',
						width: '877.745px',
						height: '871.967px',
					}}
					aria-hidden="true"
				>
					<div style={{ transform: 'rotate(90.28deg) scaleY(-1)', flexShrink: 0 }}>
						<div style={{ width: '460px', height: '790px', position: 'relative' }}>
							<Image
								width={460}
								height={790}
								alt=""
								className="absolute block max-w-none size-full"
								src={CTA_DECORATIVE}
							/>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="relative z-10 flex flex-col items-center gap-[24px] md:gap-[32px] py-[48px] md:py-[64px] lg:py-[84px] px-4">
					<p className="font-heading font-semibold text-[26px] leading-[32px] md:text-[32px] md:leading-[38px] lg:text-[40px] lg:leading-[40px] text-[#f7f7f7] text-center max-w-[600px]">
						{"Let's push boundaries, together."}
					</p>
					<Link
						href="/contact"
						className="inline-flex items-center gap-[8px] border border-solid border-[#f7f7f7] rounded-[48px] px-[24px] py-[8px] hover:bg-white/10 transition-colors"
					>
						<span className="font-heading font-bold text-[16px] leading-[26px] text-[#f7f7f7]">{"Let's talk"}</span>
						<span className="flex items-center justify-center shrink-0">
							<ChevronRight
								style={{
									width: '20px',
									height: '20px',
									display: 'block',
									transformOrigin: 'center',
								}}
							/>
						</span>
					</Link>
				</div>
			</div>

			{/* ── Footer Body ─────────────────────────────────────────────── */}
			<div className="w-full bg-[#0b2d34]">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[135px] pt-[48px] lg:pt-[80px] flex flex-col gap-[30px] lg:gap-[30px]">
					{/* Top row — stacks on mobile, side-by-side on desktop */}
					<div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[64px] items-start">
						{/* Brand column */}
						<div className="flex flex-col gap-[24px] w-full lg:w-[315px] lg:shrink-0">
							<div className="flex flex-col gap-[16px] lg:gap-[24px]">
								<Link href="/" className="inline-block">
									<Image
										src={logoUrl}
										alt="Insighture"
										width={196}
										height={40}
										className="h-[36px] lg:h-[40px] w-auto"
									/>
								</Link>

								{globals?.description && (
									<p className="font-sans font-normal text-[14px] leading-[20px] text-[rgba(247,247,247,0.7)] max-w-[315px]">
										{globals.description}
									</p>
								)}

								{globals?.social_links && globals.social_links.length > 0 && (
									<div className="flex items-center gap-[16px]">
										{globals.social_links.map((social) => (
											<Link
												key={social.service}
												href={social.url}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={social.service}
												className="size-[20px] opacity-70 hover:opacity-100 transition-opacity"
											>
												<Image
													src={`/icons/social/${social.service}.svg`}
													alt={social.service}
													width={20}
													height={20}
													className="size-full invert"
												/>
											</Link>
										))}
									</div>
								)}
							</div>

							{/* Certification badges */}
							<div className="flex gap-[12px] lg:gap-[16px] items-center flex-wrap md:flex-nowrap">
								<div className="flex items-center gap-[8px] bg-[rgba(247,247,247,0.1)] rounded-[10px] px-[12px] lg:px-[16px] h-[48px] lg:h-[52px] shrink-0">
									<Image
										src={ISO_BADGE}
										width={24}
										height={24}
										alt="ISO 27001:2022 certified"
										className="size-[20px] lg:size-[24px]"
									/>
									<div className="flex flex-col">
										<span className="font-sans text-[11px] lg:text-[12px] leading-[16px] text-[rgba(247,247,247,0.7)]">
											Certified
										</span>
										<span className="font-sans text-[13px] lg:text-[14px] leading-[20px] text-[#f7f7f7]">
											ISO 27001:2022
										</span>
									</div>
								</div>
								<div className="flex items-center gap-[8px] bg-[rgba(247,247,247,0.1)] rounded-[10px] px-[12px] lg:px-[16px] h-[48px] lg:h-[52px] shrink-0">
									<Image
										src={AWS_BADGE}
										width={36}
										height={36}
										alt="AWS Advanced Partner"
										className="size-[32px] lg:size-[36px]"
									/>
									<div className="flex flex-col">
										<span className="font-sans text-[11px] lg:text-[12px] leading-[16px] text-[rgba(247,247,247,0.7)]">
											AWS
										</span>
										<span className="font-sans text-[13px] lg:text-[14px] leading-[20px] text-[#f7f7f7]">
											Advanced Partner
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Nav columns — 2-col grid on mobile, row on desktop */}
						{navItems.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-1 lg:items-start lg:justify-evenly gap-x-4 gap-y-[32px] lg:gap-0 w-full">
								{navItems.map((item) => {
									const href = item.page?.permalink ?? item.url ?? '#';
									const hasChildren = item.children && item.children.length > 0;

									return (
										<div key={item.id} className="flex flex-col gap-[12px] lg:gap-[16px]">
											{hasChildren ? (
												<p className="font-sans font-semibold lg:font-normal text-[14px] lg:text-[16px] leading-[24px] text-[#f7f7f7]">
													{item.title}
												</p>
											) : (
												<Link
													href={href}
													className="font-sans font-semibold lg:font-normal text-[14px] lg:text-[16px] leading-[24px] text-[#f7f7f7] hover:text-white transition-colors"
												>
													{item.title}
												</Link>
											)}

											{hasChildren && (
												<div className="flex flex-col gap-[10px] lg:gap-[12px]">
													{item.children!.map((child) => {
														const childHref = child.page?.permalink ?? child.url ?? '#';

														return (
															<Link
																key={child.id}
																href={childHref}
																className="font-sans font-normal text-[13px] lg:text-[14px] leading-[20px] text-[rgba(247,247,247,0.7)] hover:text-[#f7f7f7] transition-colors"
															>
																{child.title}
															</Link>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Locations */}
					<p className="font-sans font-medium text-[13px] lg:text-[14px] leading-[20px] text-[rgba(247,247,247,0.7)]">
						Australia &nbsp;|&nbsp; Sri Lanka &nbsp;|&nbsp; Singapore
					</p>

					{/* Bottom bar */}
					<div className="border-t-[0.5px] border-[#f7f7f7] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-[16px]">
						<p className="font-sans font-normal text-[13px] lg:text-[14px] leading-[20px] text-[rgba(247,247,247,0.7)]">
							© {new Date().getFullYear()} Insighture. All rights reserved.
						</p>
						<div className="flex items-center gap-[16px] lg:gap-[24px] flex-wrap">
							{[
								{ label: 'Privacy Policy', href: '/privacy-policy' },
								{ label: 'Terms of Service', href: '/terms-of-service' },
								{ label: 'Accessibility Statement', href: '/accessibility' },
								{ label: 'Cookie Policy', href: '/cookie-policy' },
							].map(({ label, href }) => (
								<Link
									key={label}
									href={href}
									className="font-sans font-normal text-[13px] lg:text-[14px] leading-[20px] text-[rgba(247,247,247,0.7)] hover:text-[#f7f7f7] transition-colors"
								>
									{label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
});

Footer.displayName = 'Footer';
export default Footer;
