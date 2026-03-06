import { DirectusFile } from '@/types/directus-schema';

const assetsBaseURL = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

export function getDirectusAssetURL(fileOrString: string | DirectusFile | null | undefined): string {
	if (!fileOrString) return '';

	if (typeof fileOrString === 'string') {
		return `${assetsBaseURL}/assets/${fileOrString}`;
	}

	return `${assetsBaseURL}/assets/${fileOrString.id}`;
}
