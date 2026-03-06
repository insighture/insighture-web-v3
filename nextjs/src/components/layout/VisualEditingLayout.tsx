'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';
import { useNavOverrides } from '@/contexts/NavOverridesContext';

interface VisualEditingLayoutProps {
	headerNavigation: any;
	footerNavigation: any;
	globals: any;
	children: ReactNode;
}

export default function VisualEditingLayout({
	headerNavigation,
	footerNavigation,
	globals,
	children,
}: VisualEditingLayoutProps) {
	const navRef = useRef<HTMLElement>(null);
	const footerRef = useRef<HTMLElement>(null);
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();
	const { navOverrides } = useNavOverrides();

	// Apply page-level nav style overrides. When a page sets these, they drive
	// NavigationBar appearance; when unset, NavigationBar falls back to its defaults.
	const mergedNav = navOverrides
		? {
				...headerNavigation,
				overlay_mode:
					navOverrides.nav_overlay_mode === 'overlay'
						? true
						: navOverrides.nav_overlay_mode === 'sticky'
							? false
							: undefined,
				background_color: navOverrides.nav_background_color ?? undefined,
				text_color: navOverrides.nav_text_color ?? undefined,
				text_hover_color: navOverrides.nav_text_hover_color ?? undefined,
				scrolled_background_color: navOverrides.nav_scrolled_background_color ?? undefined,
				scrolled_text_color: navOverrides.nav_scrolled_text_color ?? undefined,
				scrolled_text_hover_color: navOverrides.nav_scrolled_text_hover_color ?? undefined,
				dropdown_background_color: navOverrides.nav_dropdown_background_color ?? undefined,
				dropdown_text_color: navOverrides.nav_dropdown_text_color ?? undefined,
				dropdown_text_hover_color: navOverrides.nav_dropdown_text_hover_color ?? undefined,
				logo_override: navOverrides.nav_logo_override ?? undefined,
				cta_background_color: navOverrides.nav_cta_background_color ?? undefined,
				cta_text_color: navOverrides.nav_cta_text_color ?? undefined,
			}
		: headerNavigation;

	useEffect(() => {
		if (isVisualEditingEnabled) {
			if (navRef.current) {
				apply({
					elements: [navRef.current],
					onSaved: () => router.refresh(),
				});
			}
			if (footerRef.current) {
				apply({
					elements: [footerRef.current],
					onSaved: () => router.refresh(),
				});
			}
		}
	}, [isVisualEditingEnabled, apply, router]);

	return (
		<>
			<NavigationBar ref={navRef} navigation={mergedNav} globals={globals} />
			{children}
			<Footer ref={footerRef} navigation={footerNavigation} globals={globals} />
		</>
	);
}
