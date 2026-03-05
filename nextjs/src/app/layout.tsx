import '@/styles/globals.css';
import { Albert_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import { Metadata } from 'next';

const albertSans = Albert_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
	style: ['normal', 'italic'],
	variable: '--font-albert-sans',
	display: 'swap',
});

import VisualEditingLayout from '@/components/layout/VisualEditingLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { NavOverridesProvider } from '@/contexts/NavOverridesContext';
import { FooterCTAProvider } from '@/contexts/FooterCTAContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { fetchSiteData } from '@/lib/directus/fetchers';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';

export async function generateMetadata(): Promise<Metadata> {
	const { globals } = await fetchSiteData();

	const siteTitle = globals?.title || 'Simple CMS';
	const siteDescription = globals?.description || 'A starter CMS template powered by Next.js and Directus.';
	const faviconURL = globals?.favicon ? getDirectusAssetURL(globals.favicon) : '/favicon.ico';

	return {
		title: {
			default: siteTitle,
			template: `%s | ${siteTitle}`,
		},
		description: siteDescription,
		icons: {
			icon: faviconURL,
		},
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { globals, headerNavigation, footerNavigation } = await fetchSiteData();
	const accentColor = globals?.accent_color || '#6644ff';

	return (
		<html lang="en" className={albertSans.variable} style={{ '--accent-color': accentColor } as React.CSSProperties} suppressHydrationWarning>
			<body className="antialiased font-sans flex flex-col min-h-screen">
				<NavOverridesProvider>
				<FooterCTAProvider>
					<NavigationProvider>
						<ThemeProvider>
							<VisualEditingLayout
								headerNavigation={headerNavigation}
								footerNavigation={footerNavigation}
								globals={globals}
							>
								<main className="flex-grow">{children}</main>
							</VisualEditingLayout>
						</ThemeProvider>
					</NavigationProvider>
				</FooterCTAProvider>
				</NavOverridesProvider>
			</body>
		</html>
	);
}
