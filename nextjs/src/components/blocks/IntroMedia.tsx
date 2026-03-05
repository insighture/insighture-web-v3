'use client';

import DirectusImage from '@/components/shared/DirectusImage';
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
		<div className="bg-[#0b2d34] w-full flex items-center overflow-hidden py-16 lg:py-[64px]">
			{/* Left: text content */}
			<div className="flex items-stretch gap-8 flex-1 pl-8 lg:pl-[120px] pr-8 lg:pr-[80px] py-4">
				{/* Pink vertical accent line */}
				<div className="w-[3px] shrink-0 bg-[#ee4065] rounded-full" />

				<div className="flex flex-col gap-10 text-[#fcfcfd]">
					{heading && (
						<div
							className="font-heading font-medium text-[40px] lg:text-[48px] leading-[56px] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
							data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: 'heading', mode: 'popover' })}
							dangerouslySetInnerHTML={{ __html: heading }}
						/>
					)}
					{description && (
						<p
							className="font-sans font-normal text-[16px] leading-[24px] text-[#fcfcfd] max-w-[487px]"
							data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: 'description', mode: 'popover' })}
						>
							{description}
						</p>
					)}
				</div>
			</div>

			{/* Right: image / video */}
			<div
				className="shrink-0 w-[55%] lg:w-[700px] h-[340px] lg:h-[480px] rounded-tl-[8px] rounded-bl-[8px] overflow-hidden relative"
				data-directus={setAttr({ collection: 'block_intro_media', item: id, fields: video_url ? 'video_url' : 'image', mode: 'popover' })}
			>
				{video_url ? (
					<VideoEmbed url={video_url} />
				) : image ? (
					<DirectusImage
						uuid={image}
						alt={heading ?? ''}
						fill
						sizes="700px"
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-[#0f3b43]" />
				)}
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
			className="w-full h-full"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			title="Video"
		/>
	);
}
