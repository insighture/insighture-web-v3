import type { NextConfig } from 'next';
import initializeBundleAnalyzer from '@next/bundle-analyzer';
import { generateRedirects } from './src/lib/redirects';

const withBundleAnalyzer = initializeBundleAnalyzer({
	enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true',
});

const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    frame-src *;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src *;
    connect-src *;
    font-src 'self' data:;
    frame-ancestors 'self' http://localhost:3000 http://localhost:8055 ${process.env.NEXT_PUBLIC_DIRECTUS_URL} http://ec2-54-160-149-229.compute-1.amazonaws.com;
`;

const nextConfig: NextConfig = {
	output: 'standalone',
	webpack: (config) => {
		return config;
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'directus-backend.qr.insighture.com',
				pathname: '/assets/**',
			},
			{
				protocol: 'http',
				hostname: 'ec2-54-160-149-229.compute-1.amazonaws.com',
				pathname: '/assets/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8055',
				pathname: '/assets/**',
			},
			{
				protocol: 'https',
				hostname: 'd3eoeq8oukupzt.cloudfront.net',
				pathname: '/assets/**',
			},
		],
	},
	env: {
		DIRECTUS_PUBLIC_TOKEN: process.env.DIRECTUS_PUBLIC_TOKEN,
		DIRECTUS_FORM_TOKEN: process.env.DIRECTUS_FORM_TOKEN,
		DRAFT_MODE_SECRET: process.env.DRAFT_MODE_SECRET,
		DIRECTUS_URL: process.env.DIRECTUS_URL,
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: ContentSecurityPolicy.replace(/\n/g, '').trim(),
					},
				],
			},
		];
	},
	async redirects() {
		// generateRedirects handles errors gracefully and returns empty array if Directus is unavailable
		const redirects = await generateRedirects();
		
return redirects;
	},
};

export default withBundleAnalyzer(nextConfig);
