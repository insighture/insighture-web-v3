'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface FooterCTAOverrides {
	footer_cta_text?: string | null;
	footer_cta_button_text?: string | null;
	footer_cta_button_url?: string | null;
	footer_cta_button_page?: { permalink: string | null } | null;
}

interface FooterCTAContextValue {
	footerCTA: FooterCTAOverrides | null;
	setFooterCTA: (overrides: FooterCTAOverrides | null) => void;
}

const FooterCTAContext = createContext<FooterCTAContextValue>({
	footerCTA: null,
	setFooterCTA: () => {},
});

export function FooterCTAProvider({ children }: { children: ReactNode }) {
	const [footerCTA, setFooterCTA] = useState<FooterCTAOverrides | null>(null);

	return (
		<FooterCTAContext.Provider value={{ footerCTA, setFooterCTA }}>
			{children}
		</FooterCTAContext.Provider>
	);
}

export const useFooterCTA = () => useContext(FooterCTAContext);
