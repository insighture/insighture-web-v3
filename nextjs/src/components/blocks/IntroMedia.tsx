'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface IntroMediaData {
	id: number | string;
	heading?: string | null;
	description?: string | null;
	image?: string | null;
	video_url?: string | null;
}

export default function IntroMedia({ data }: { data: IntroMediaData }) {
	const { id, heading, description, image, video_url } = data;

	return (
		<div className="bg-[#0b2d34] w-full overflow-hidden">
		<div className="flex flex-col lg:flex-row items-center pt-10 md:pt-12 lg:py-[64px] max-w-[1400px] mx-auto">
			{/* Left: text content */}
			<div className="flex items-stretch gap-6 md:gap-8 flex-1 py-4 px-6 sm:px-10 md:px-16 lg:pl-[120px] lg:pr-[80px]">
				{/* Pink vertical accent line */}
				<div className="w-[3px] shrink-0 bg-[#ee4065] rounded-full" />

				<div className="flex flex-col gap-6 md:gap-10 text-[#fcfcfd]">
					{heading && (
						<div
							className="font-heading font-medium text-[28px] md:text-[36px] lg:text-[48px] leading-[1.2] lg:leading-[56px] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
							data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: 'heading', mode: 'popover' })}
							dangerouslySetInnerHTML={{ __html: heading }}
						/>
					)}
					{description && (
						<p
							className="font-sans font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-[#fcfcfd] max-w-[487px]"
							data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: 'description', mode: 'popover' })}
						>
							{description}
						</p>
					)}
				</div>
			</div>

			{/* Right: image / video */}
			<div
				className="w-full lg:shrink-0 lg:w-[calc(700px+max(0px,(100vw-1400px)/2))] h-[240px] sm:h-[300px] md:h-[380px] lg:h-[480px] lg:rounded-l-[8px] overflow-hidden relative mt-6 lg:mt-0 lg:mr-[calc(-1*max(0px,(100vw-1400px)/2))]"
				data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: video_url ? 'video_url' : 'image', mode: 'popover' })}
			>
				{video_url ? (
					<VideoEmbed url={video_url} />
				) : image ? (
					<DirectusImage
						uuid={image}
						alt={heading ?? ''}
						fill
						sizes="(max-width: 1024px) 100vw, 700px"
						className="object-cover"
					/>
				) : (
					<div className="size-full bg-[#0f3b43]" />
				)}
			</div>
		</div>
		</div>
	);
}

function VideoEmbed({ url }: { url: string }) {
	// Convert YouTube / Vimeo watch URLs to embed URLs.
	let embedUrl = url;
	const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
	if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
	const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
	if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;

	return (
		<iframe
			src={embedUrl}
			className="size-full"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			title="Video"
		/>
	);
}
