'use client';

import { useCallback, useEffect, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
	const readyRef = useRef(false);

	useEffect(() => {
		if (!SITE_KEY || readyRef.current) return;

		if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
			readyRef.current = true;

			return;
		}

		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			readyRef.current = true;
		};
		document.head.appendChild(script);
	}, []);

	const getToken = useCallback(async (action = 'submit'): Promise<string | null> => {
		if (!SITE_KEY) return null;

		try {
			// Wait for grecaptcha to be available (max 5s, no polling)
			if (!window.grecaptcha) {
				await new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => reject(new Error('reCAPTCHA timeout')), 5000);
					const observer = new MutationObserver(() => {
						if (window.grecaptcha) {
							observer.disconnect();
							clearTimeout(timeout);
							resolve();
						}
					});
					observer.observe(document.head, { childList: true, subtree: true });
					if (window.grecaptcha) {
						observer.disconnect();
						clearTimeout(timeout);
						resolve();
					}
				});
			}

			const token = await window.grecaptcha.execute(SITE_KEY, { action });

			return token;
		} catch (error) {
			console.error('reCAPTCHA error:', error);

			return null;
		}
	}, []);

	return { getToken, isEnabled: !!SITE_KEY };
}
