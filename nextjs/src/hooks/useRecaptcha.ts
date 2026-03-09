'use client';

import { useCallback, useEffect } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
	useEffect(() => {
		if (!SITE_KEY) return;

		// Don't load if already present
		if (document.querySelector(`script[src*="recaptcha/api.js"]`)) return;

		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
		script.async = true;
		document.head.appendChild(script);
	}, []);

	const getToken = useCallback(async (action = 'submit'): Promise<string | null> => {
		if (!SITE_KEY) return null;

		try {
			await new Promise<void>((resolve) => {
				if (window.grecaptcha) {
					resolve();
				} else {
					const check = setInterval(() => {
						if (window.grecaptcha) {
							clearInterval(check);
							resolve();
						}
					}, 100);
				}
			});

			const token = await window.grecaptcha.execute(SITE_KEY, { action });

			return token;
		} catch (error) {
			console.error('reCAPTCHA error:', error);

			return null;
		}
	}, []);

	return { getToken, isEnabled: !!SITE_KEY };
}
