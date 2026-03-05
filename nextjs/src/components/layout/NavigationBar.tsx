'use client';

import { useState, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Menu } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import SearchModal from '@/components/ui/SearchModal';
import Container from '@/components/ui/container';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';
import { useNavigationOptional } from '@/contexts/NavigationContext';

interface NavigationBarProps {
	navigation: any;
	globals: any;
}

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({ navigation, globals }, ref) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	// Dynamic navigation colors from Hero slides
	const navigationContext = useNavigationOptional();
	const contextColors = navigationContext?.colors || {};

	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	// Determine logo URLs - override from slide if available, otherwise use global
	const slideLogoOverride = contextColors.logoOverride;
	const darkLogoUrl = globals?.logo_dark_mode ? `${directusURL}/assets/${globals.logo_dark_mode}` : '';

	// Determine if logo should be hidden
	const shouldHideLogo = contextColors.hideLogo === true;

	const overlayMode = navigation?.overlay_mode ?? false;
	const bgColor = navigation?.background_color;
	const bgImage = navigation?.background_image;
	const textColor = navigation?.text_color;
	const textHoverColor = navigation?.text_hover_color;
	const scrolledBgColor = navigation?.scrolled_background_color;
	const scrolledTextColor = navigation?.scrolled_text_color;
	const scrolledTextHoverColor = navigation?.scrolled_text_hover_color;
	const dropdownBgColor = navigation?.dropdown_background_color;
	const dropdownTextColor = navigation?.dropdown_text_color;
	const dropdownTextHoverColor = navigation?.dropdown_text_hover_color;

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// Effective background: context from Hero takes priority, then scrolled state, then defaults
	const effectiveBg = scrolled
		? contextColors.scrolledBackgroundColor || scrolledBgColor || bgColor || '#ec2b54'
		: overlayMode
			? bgColor || 'transparent'
			: bgColor || '#ec2b54';

	// Effective text color: context colors (from Hero) take priority, then scrolled state, then default
	const effectiveTextColor = scrolled
		? contextColors.scrolledTextColor || scrolledTextColor || contextColors.textColor || textColor || '#f7f7f7'
		: contextColors.textColor || textColor || '#f7f7f7';

	// Effective hover color: context colors take priority, then scrolled state, then default
	const effectiveHoverColor = scrolled
		? contextColors.scrolledTextHoverColor || scrolledTextHoverColor || contextColors.textHoverColor || textHoverColor || undefined
		: contextColors.textHoverColor || textHoverColor || undefined;

	// Effective dropdown colors: context from Hero takes priority, then navigation defaults
	const effectiveDropdownBgColor = contextColors.dropdownBackgroundColor || dropdownBgColor || '#ffffff';
	const effectiveDropdownTextColor = contextColors.dropdownTextColor || dropdownTextColor || '#1d2939';
	const effectiveDropdownTextHoverColor = contextColors.dropdownTextHoverColor || dropdownTextHoverColor || undefined;

	// Effective CTA button colors: context from Hero takes priority, with scrolled state support
	const effectiveCtaBgColor = scrolled
		? contextColors.scrolledCtaBackgroundColor || contextColors.ctaBackgroundColor || '#ffffff'
		: contextColors.ctaBackgroundColor || '#ffffff';
	const effectiveCtaTextColor = scrolled
		? contextColors.scrolledCtaTextColor || contextColors.ctaTextColor || '#ec2b54'
		: contextColors.ctaTextColor || '#ec2b54';

	const headerStyle: React.CSSProperties = {
		...(effectiveBg && effectiveBg !== 'transparent' ? { backgroundColor: effectiveBg } : {}),
		...(effectiveBg === 'transparent' ? { backgroundColor: 'transparent' } : {}),
		...(bgImage
			? {
					backgroundImage: `url(${directusURL}/assets/${bgImage})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}
			: {}),
	};

	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	return (
		<>
		{(effectiveHoverColor || effectiveDropdownTextHoverColor) && (
			<style>{[
				effectiveHoverColor && `.nav-links a:hover, .nav-links button:hover { color: ${effectiveHoverColor} !important; }`,
				effectiveDropdownTextHoverColor && `.nav-dropdown a:hover { color: ${effectiveDropdownTextHoverColor} !important; }`,
			].filter(Boolean).join('\n')}</style>
		)}
		<header
			ref={ref}
			className={cn(
				'top-0 z-[60] w-full transition-all duration-300 border-b border-white/20',
				overlayMode ? 'fixed' : 'sticky',
				scrolled && 'shadow-md',
				!effectiveBg && 'bg-background',
				!effectiveTextColor && 'text-foreground',
			)}
			style={headerStyle}
		>
			<div className="flex items-center justify-between p-4 md:px-8 lg:px-[120px] md:py-6">
				{/* Logo - Left (keeps space even when hidden, but always shows when scrolled) */}
				<div className="flex-shrink-0 w-[100px] md:w-[120px] lg:w-[157px]">
					{(!shouldHideLogo || scrolled) && (
						<Link href="/" className="focus:outline-none block">
							{scrolled ? (
								// When scrolled, always use dark mode logo (never slide override)
								<Image
									key={`scrolled-${globals?.logo_dark_mode}`}
									src={darkLogoUrl}
									alt="Logo"
									width={150}
									height={100}
									className="w-[100px] md:w-[120px] lg:w-[157px] h-auto"
									priority
								/>
							) : slideLogoOverride ? (
								// Not scrolled + slide override exists = use override
								<Image
									key={`override-${slideLogoOverride}`}
									src={`${directusURL}/assets/${slideLogoOverride}?v=${slideLogoOverride}`}
									alt="Logo"
									className="w-[100px] md:w-[120px] lg:w-[157px] h-auto"
									width={150}
									height={100}
									priority
								/>
							) : (
								// Not scrolled + no override = theme-based defaults
								<>
									<Image
										key={`default-${globals?.logo}`}
										src={globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo.svg'}
										alt="Logo"
										width={150}
										height={100}
										className="w-[100px] md:w-[120px] lg:w-[157px] h-auto dark:hidden"
										priority
									/>
									{darkLogoUrl && (
										<Image
											key={`dark-${globals?.logo_dark_mode}`}
											src={darkLogoUrl}
											alt="Logo (Dark Mode)"
											width={150}
											height={100}
											className="w-[100px] md:w-[120px] lg:w-[157px] h-auto hidden dark:block"
											priority
										/>
									)}
								</>
							)}
						</Link>
					)}
				</div>

				{/* Navigation - Center */}
				<nav
					className="nav-links hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2"
					style={effectiveTextColor ? { color: effectiveTextColor } : undefined}
				>
					<NavigationMenu
						data-directus={
							navigation
								? setAttr({
										collection: 'navigation',
										item: navigation.id,
										fields: ['items'],
										mode: 'modal',
									})
								: undefined
						}
					>
						<NavigationMenuList className="flex gap-8">
							{navigation?.items?.map((section: any) => (
								<NavigationMenuItem key={section.id} className="relative group/navitem">
									<NavigationMenuLink
											href={section.page?.permalink || section.url || '#'}
											className="font-heading text-nav focus:outline-none"
										>
											{section.title}
										</NavigationMenuLink>
										{/* Removing to make the Navbar work */}
									{/* {section.children && section.children.length > 0 ? (
										<>
											<NavigationMenuTrigger className="focus:outline-none !bg-transparent text-[14px] font-medium flex items-center gap-2.5">
												<span>{section.title}</span>
											</NavigationMenuTrigger>
											<NavigationMenuContent className="nav-dropdown absolute min-w-[200px] rounded-lg shadow-lg p-2" style={{
													backgroundColor: effectiveDropdownBgColor,
													color: effectiveDropdownTextColor,
												}}>
												<ul className="flex flex-col gap-1">
													{section.children.map((child: any) => (
														<li key={child.id}>
															<NavigationMenuLink
																href={child.page?.permalink || child.url || '#'}
																className="text-[14px] font-medium px-3 py-2 rounded hover:bg-gray-100 block focus:outline-none transition-colors"
															>
																{child.title}
															</NavigationMenuLink>
														</li>
													))}
												</ul>
											</NavigationMenuContent>
										</>
									) : (
										<NavigationMenuLink
											href={section.page?.permalink || section.url || '#'}
											className="text-[14px] font-medium focus:outline-none hover:opacity-80 transition-opacity"
										>
											{section.title}
										</NavigationMenuLink>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</nav>

				{/* Right Side - CTA + Search + Mobile Menu */}
				<div className="flex items-center gap-3 md:gap-4 lg:gap-10">
					{/* CTA Button - Visible on tablet and desktop */}
					<Button
						asChild
						className="font-semibold text-[14px] md:text-[16px] px-4 md:px-6 py-2 h-[36px] md:h-[40px] rounded-full hidden md:flex hover:opacity-90"
						style={{
							backgroundColor: effectiveCtaBgColor,
							color: effectiveCtaTextColor,
						}}
					>
						<Link href="/contact">Let's talk</Link>
					</Button>

					{/* Search - Icon on mobile/tablet, text+icon on desktop */}
					<SearchModal>
						<button className="flex items-center gap-2.5 text-[16px] font-medium hover:opacity-80 transition-opacity">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
								<path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18.5 18.5l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<span className="hidden lg:inline">Search</span>
						</button>
					</SearchModal>

					{/* Mobile/Tablet Menu */}
					<div className="flex lg:hidden">
						<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									aria-label="Open menu"
									className="text-current hover:bg-white/10"
								>
									<Menu className="size-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-sm p-4 shadow-lg mr-2">
								<div className="flex flex-col gap-3">
									{navigation?.items?.map((section: any) => (
										<div key={section.id}>
											{section.children && section.children.length > 0 ? (
												<Collapsible>
													<CollapsibleTrigger className="font-medium text-[15px] hover:opacity-70 w-full text-left flex items-center justify-between focus:outline-none py-1">
														<span>{section.title}</span>
														<ChevronDown className="size-4 transition-transform" />
													</CollapsibleTrigger>
													<CollapsibleContent className="ml-3 mt-2 flex flex-col gap-2">
														{section.children.map((child: any) => (
															<Link
																key={child.id}
																href={child.page?.permalink || child.url || '#'}
																className="text-[14px] py-1 hover:opacity-70"
																onClick={handleLinkClick}
															>
																{child.title}
															</Link>
														))}
													</CollapsibleContent>
												</Collapsible>
											) : (
												<Link
													href={section.page?.permalink || section.url || '#'}
													className="font-medium text-[15px] hover:opacity-70 block py-1"
													onClick={handleLinkClick}
												>
													{section.title}
												</Link>
											)}
										</div>
									))}
									{/* CTA in mobile menu - only on small mobile */}
									<Link
										href="/contact"
										className="font-semibold text-center py-2.5 px-4 rounded-full mt-2 md:hidden"
										style={{
											backgroundColor: effectiveCtaBgColor,
											color: effectiveCtaTextColor,
										}}
										onClick={handleLinkClick}
									>
										Let's talk
									</Link>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
		</>
	);
});
NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;