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

interface NavigationBarProps {
	navigation: any;
	globals: any;
}

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({ navigation, globals }, ref) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const lightLogoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo.svg';
	const darkLogoUrl = globals?.logo_dark_mode ? `${directusURL}/assets/${globals.logo_dark_mode}` : '';

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

	// Effective background: overlay starts transparent unless CMS sets a color
	const effectiveBg = scrolled
		? scrolledBgColor || bgColor || undefined
		: overlayMode
			? bgColor || 'transparent'
			: bgColor || undefined;

	// Effective text color: scrolled state overrides default
	const effectiveTextColor = scrolled
		? scrolledTextColor || textColor || undefined
		: textColor || undefined;

	// Effective hover color: scrolled state overrides default
	const effectiveHoverColor = scrolled
		? scrolledTextHoverColor || textHoverColor || undefined
		: textHoverColor || undefined;

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
		{(effectiveHoverColor || dropdownTextHoverColor) && (
			<style>{[
				effectiveHoverColor && `.nav-links a:hover, .nav-links button:hover { color: ${effectiveHoverColor} !important; }`,
				dropdownTextHoverColor && `.nav-dropdown a:hover { color: ${dropdownTextHoverColor} !important; }`,
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
			<Container className="flex items-center justify-between p-4">
				<Link href="/" className="flex-shrink-0 focus:outline-none">
					<Image
						src={lightLogoUrl}
						alt="Logo"
						width={150}
						height={100}
						className="w-[120px] h-auto dark:hidden"
						priority
					/>
					{darkLogoUrl && (
						<Image
							src={darkLogoUrl}
							alt="Logo (Dark Mode)"
							width={150}
							height={100}
							className="w-[120px] h-auto hidden dark:block"
							priority
						/>
					)}
				</Link>

				<nav
					className="nav-links flex items-center gap-4"
					style={effectiveTextColor ? { color: effectiveTextColor } : undefined}
				>
					<NavigationMenu
						className="hidden md:flex"
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
						<NavigationMenuList className="flex gap-6">
							{navigation?.items?.map((section: any) => (
								<NavigationMenuItem key={section.id} className="relative group/navitem">
									{section.children && section.children.length > 0 ? (
										<>
											<NavigationMenuTrigger className="focus:outline-none !bg-transparent">
												<span className="font-heading text-nav">{section.title}</span>
											</NavigationMenuTrigger>
											<NavigationMenuContent className="nav-dropdown absolute mt-2 min-w-[150px] rounded-md bg-background p-4 shadow-md" style={{
													...(dropdownBgColor ? { backgroundColor: dropdownBgColor } : {}),
													...(dropdownTextColor ? { color: dropdownTextColor } : {}),
												}}>
												<ul className="flex flex-col gap-2 pb-4">
													{section.children.map((child: any) => (
														<li key={child.id}>
															<NavigationMenuLink
																href={child.page?.permalink || child.url || '#'}
																className="font-heading text-nav focus:outline-none"
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
											className="font-heading text-nav focus:outline-none"
										>
											{section.title}
										</NavigationMenuLink>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>

					<div className="flex md:hidden">
						<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="link"
									size="icon"
									aria-label="Open menu"
									className="dark:text-white dark:hover:text-accent"
								>
									<Menu />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="top-full w-screen p-6 shadow-md max-w-full overflow-hidden">
								<div className="flex flex-col gap-4">
									{navigation?.items?.map((section: any) => (
										<div key={section.id}>
											{section.children && section.children.length > 0 ? (
												<Collapsible>
													<CollapsibleTrigger className="font-heading text-nav hover:text-accent w-full text-left flex items-center focus:outline-none">
														<span>{section.title}</span>
														<ChevronDown className="size-4 ml-1 hover:rotate-180 active:rotate-180 focus:rotate-180" />
													</CollapsibleTrigger>
													<CollapsibleContent className="ml-4 mt-2 flex flex-col gap-2">
														{section.children.map((child: any) => (
															<Link
																key={child.id}
																href={child.page?.permalink || child.url || '#'}
																className="font-heading text-nav"
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
													className="font-heading text-nav"
													onClick={handleLinkClick}
												>
													{section.title}
												</Link>
											)}
										</div>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</nav>

				<div className="flex items-center gap-4">
					<SearchModal />
					<ThemeToggle />
				</div>
			</Container>
		</header>
		</>
	);
});
NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;
