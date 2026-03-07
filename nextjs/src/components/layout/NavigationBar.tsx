'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useNavigationOptional } from '@/contexts/NavigationContext';
import { cn, debounce } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';
import { ChevronDown, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

interface NavigationBarProps {
	navigation: any;
	globals: any;
}

type SearchResult = {
	id: string;
	title: string;
	description: string;
	type: string;
	link: string;
};

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({ navigation, globals }, ref) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	// Inline search state
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchSearched, setSearchSearched] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const debouncedSearch = useCallback(
		debounce(async (query: string) => {
			if (query.length < 3) {
				setSearchResults([]);
				setSearchSearched(false);
				
				return;
			}
			setSearchLoading(true);
			setSearchSearched(true);
			try {
				const res = await fetch(`/api/search?search=${encodeURIComponent(query)}`);
				if (!res.ok) throw new Error('Failed to fetch');
				const data: SearchResult[] = await res.json();
				setSearchResults(data.filter((r) => r.link));
			} catch {
				setSearchResults([]);
			} finally {
				setSearchLoading(false);
			}
		}, 300),
		[]
	);

	const openSearch = () => {
		setSearchOpen(true);
		setTimeout(() => searchInputRef.current?.focus(), 150);
	};

	const closeSearch = () => {
		setSearchOpen(false);
		setSearchQuery('');
		setSearchResults([]);
		setSearchSearched(false);
		setSearchLoading(false);
	};

	// Close search on click outside
	useEffect(() => {
		if (!searchOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
				closeSearch();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [searchOpen]);

	// Close search on Escape, open on Ctrl+K
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && searchOpen) closeSearch();
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				searchOpen ? closeSearch() : openSearch();
			}
		};
		document.addEventListener('keydown', onKeyDown);

		return () => document.removeEventListener('keydown', onKeyDown);
	}, [searchOpen]);

	// Dynamic navigation colors from Hero slides
	const navigationContext = useNavigationOptional();
	const contextColors = navigationContext?.colors || {};

	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	// Determine logo URLs - override from slide > page > global
	const slideLogoOverride = contextColors.logoOverride;
	const pageLogoOverride = navigation?.logo_override;
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

	// Page-level CTA overrides (from navigation merged props)
	const pageCtaBgColor = navigation?.cta_background_color;
	const pageCtaTextColor = navigation?.cta_text_color;

	// Effective CTA button colors: Hero slide > page-level > defaults
	const effectiveCtaBgColor = scrolled
		? contextColors.scrolledCtaBackgroundColor || contextColors.ctaBackgroundColor || pageCtaBgColor || '#ffffff'
		: contextColors.ctaBackgroundColor || pageCtaBgColor || '#ffffff';
	const effectiveCtaTextColor = scrolled
		? contextColors.scrolledCtaTextColor || contextColors.ctaTextColor || pageCtaTextColor || '#ec2b54'
		: contextColors.ctaTextColor || pageCtaTextColor || '#ec2b54';

	const headerStyle: React.CSSProperties = {
		...(effectiveBg && effectiveBg !== 'transparent' ? { backgroundColor: effectiveBg } : {}),
		...(effectiveBg === 'transparent' ? { backgroundColor: 'transparent' } : {}),
		...(effectiveTextColor ? { color: effectiveTextColor } : {}),
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
								// When scrolled, prefer page-level logo override if set, else fall back to dark mode logo
								<Image
									key={`scrolled-${pageLogoOverride || globals?.logo_dark_mode}`}
									src={pageLogoOverride ? `${directusURL}/assets/${pageLogoOverride}` : darkLogoUrl}
									alt="Logo"
									width={150}
									height={100}
									className="w-[100px] md:w-[120px] lg:w-[157px] h-auto"
									priority
								/>
							) : (slideLogoOverride || pageLogoOverride) ? (
								// Not scrolled + slide or page override exists = use override
								<Image
									key={`override-${slideLogoOverride || pageLogoOverride}`}
									src={`${directusURL}/assets/${slideLogoOverride || pageLogoOverride}`}
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
									{section.children && section.children.length > 0 ? (
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
				<div className="flex items-center gap-3 md:gap-4 lg:gap-8">
					{/* CTA Button - Visible on tablet and desktop */}
					<Button
						asChild
						className={cn(
							'font-semibold text-[14px] md:text-[16px] px-4 md:px-6 py-2 h-[36px] md:h-[40px] rounded-full hidden md:flex hover:opacity-90 transition-all duration-300',
						)}
						style={{
							backgroundColor: effectiveCtaBgColor,
							color: effectiveCtaTextColor,
						}}
					>
						<Link href="/lets-talk">Let&#39;s talk</Link>
					</Button>

					{/* Inline Expanding Search */}
					<div ref={searchContainerRef} className="relative [&_*]:outline-none [&_*]:ring-0 [&_*]:ring-offset-0">
						<div
							className={cn(
								'flex items-center justify-end rounded-full overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
								searchOpen
									? 'w-[200px] sm:w-[260px] lg:w-[260px] border-white/30 bg-white/10 backdrop-blur-sm'
									: 'w-[28px] lg:w-[100px] border-transparent bg-transparent',
							)}
						>
							{/* Search icon — always visible, acts as open trigger when collapsed */}
							<button
								onClick={searchOpen ? undefined : openSearch}
								className={cn(
									'shrink-0 flex items-center gap-2.5 text-[16px] font-medium outline-none focus:outline-none focus-visible:outline-none transition-opacity',
									searchOpen ? 'pl-3 pointer-events-none' : 'hover:opacity-80 cursor-pointer',
								)}
								style={{ boxShadow: 'none', outline: 'none' }}
								tabIndex={searchOpen ? -1 : 0}
							>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
									<path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18.5 18.5l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								<span className={cn('hidden lg:inline transition-opacity duration-300', searchOpen && '!hidden')}>Search</span>
							</button>

							{/* Input + close — always rendered, hidden when collapsed for smooth animation */}
							<div className={cn(
								'flex items-center flex-1 min-w-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
								searchOpen ? 'opacity-100 max-w-[260px]' : 'opacity-0 max-w-0 pointer-events-none',
							)}>
								<input
									ref={searchInputRef}
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										debouncedSearch(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Escape') closeSearch();
									}}
									className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] p-2 placeholder:text-current/50"
									style={{ color: 'inherit', boxShadow: 'none', outline: 'none' }}
								/>
								<button
									onClick={closeSearch}
									className="shrink-0 pr-3 pl-1 py-2 bg-transparent border-none outline-none hover:opacity-80 transition-opacity cursor-pointer"
									aria-label="Close search"
									style={{ boxShadow: 'none', outline: 'none' }}
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
										<path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
									</svg>
								</button>
							</div>
						</div>

						{/* Search Results Dropdown */}
						{searchOpen && (searchLoading || searchSearched) && (
							<div className="absolute right-0 top-full mt-2 w-[280px] sm:w-[360px] lg:w-[420px] max-h-[400px] overflow-auto rounded-lg bg-white text-gray-900 shadow-xl border border-gray-200 z-[70]">
								{searchLoading && (
									<p className="py-4 text-sm text-center text-gray-500">Loading...</p>
								)}
								{!searchLoading && searchSearched && searchResults.length === 0 && (
									<p className="py-4 text-sm text-center text-gray-500">No results found</p>
								)}
								{!searchLoading && searchResults.length > 0 && (
									<ul className="py-2">
										{searchResults.map((result) => (
											<li key={result.id}>
												<button
													onClick={() => {
														router.push(result.link);
														closeSearch();
													}}
													className="flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
												>
													<Badge variant="default" className="shrink-0 mt-0.5">{result.type}</Badge>
													<div className="min-w-0">
														<p className="font-medium text-sm">{result.title}</p>
														{result.description && (
															<p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{result.description}</p>
														)}
													</div>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						)}
					</div>

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
										href="/lets-talk"
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