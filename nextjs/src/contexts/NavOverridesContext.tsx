'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface NavOverrides {
	nav_overlay_mode?: string | null;
	nav_background_color?: string | null;
	nav_text_color?: string | null;
	nav_text_hover_color?: string | null;
	nav_scrolled_background_color?: string | null;
	nav_scrolled_text_color?: string | null;
	nav_scrolled_text_hover_color?: string | null;
	nav_dropdown_background_color?: string | null;
	nav_dropdown_text_color?: string | null;
	nav_dropdown_text_hover_color?: string | null;
	nav_logo_override?: string | null;
	nav_cta_background_color?: string | null;
	nav_cta_text_color?: string | null;
}

interface NavOverridesContextValue {
	navOverrides: NavOverrides | null;
	setNavOverrides: (overrides: NavOverrides | null) => void;
}

const NavOverridesContext = createContext<NavOverridesContextValue>({
	navOverrides: null,
	setNavOverrides: () => {},
});

export function NavOverridesProvider({ children }: { children: ReactNode }) {
	const [navOverrides, setNavOverrides] = useState<NavOverrides | null>(null);

	return (
		<NavOverridesContext.Provider value={{ navOverrides, setNavOverrides }}>
			{children}
		</NavOverridesContext.Provider>
	);
}

export const useNavOverrides = () => useContext(NavOverridesContext);
