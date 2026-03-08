'use client';

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

interface NavigationColors {
	textColor?: string | null;
	textHoverColor?: string | null;
	scrolledBackgroundColor?: string | null;
	scrolledTextColor?: string | null;
	scrolledTextHoverColor?: string | null;
	dropdownBackgroundColor?: string | null;
	dropdownTextColor?: string | null;
	dropdownTextHoverColor?: string | null;
	ctaBackgroundColor?: string | null;
	ctaTextColor?: string | null;
	scrolledCtaBackgroundColor?: string | null;
	scrolledCtaTextColor?: string | null;
	activeTextColor?: string | null;
	activeUnderlineColor?: string | null;
	scrolledActiveTextColor?: string | null;
	scrolledActiveUnderlineColor?: string | null;
	hideLogo?: boolean | null;
	logoOverride?: string | null;
}

interface NavigationContextType {
	colors: NavigationColors;
	setColors: (colors: NavigationColors) => void;
	resetColors: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
	const [colors, setColorsState] = useState<NavigationColors>({});

	const setColors = useCallback((newColors: NavigationColors) => {
		setColorsState(newColors);
	}, []);

	const resetColors = useCallback(() => {
		setColorsState({});
	}, []);

	const value = useMemo(
		() => ({ colors, setColors, resetColors }),
		[colors, setColors, resetColors]
	);

	return (
		<NavigationContext.Provider value={value}>
			{children}
		</NavigationContext.Provider>
	);
}

export function useNavigation() {
	const context = useContext(NavigationContext);
	if (context === undefined) {
		throw new Error('useNavigation must be used within a NavigationProvider');
	}
	
	return context;
}

// Optional hook that doesn't throw error (for components that may or may not be in provider)
export function useNavigationOptional() {
	return useContext(NavigationContext);
}
