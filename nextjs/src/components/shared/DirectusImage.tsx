import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import Image, { ImageProps } from 'next/image';

export interface DirectusImageProps extends Omit<ImageProps, 'src'> {
	uuid: string;
}

const DirectusImage = ({ uuid, alt, width, height, ...rest }: DirectusImageProps) => {
	let src = getDirectusAssetURL(uuid);

	// Use Directus transforms to request a pre-resized image
	if (width && typeof width === 'number') {
		src += `?width=${width}&quality=80&format=auto`;
	}

	return <Image src={src} alt={alt} width={width} height={height} {...rest} />;
};

export default DirectusImage;
