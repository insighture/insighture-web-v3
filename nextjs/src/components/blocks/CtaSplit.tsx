'use client';

import { setAttr } from '@directus/visual-editing';

interface CtaSplitData {
	id: number | string;
	heading?: string | null;
	description?: string | null;
}

export default function CtaSplit({ data }: { data: CtaSplitData }) {
	const { id, heading, description } = data;

	return (
		<div className="bg-[#0b2d34] w-full flex items-center px-8 lg:px-[160px] pt-6 pb-12">
			<div className="flex gap-[50px] items-start w-full">
				{heading && (
					<div
						className="shrink-0 w-full lg:w-[392px] font-heading font-medium text-[40px] lg:text-[48px] leading-[56px] text-[#f7f7f7] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
						data-directus={setAttr({ collection: 'block_cta_split', item: id, fields: 'heading', mode: 'popover' })}
						dangerouslySetInnerHTML={{ __html: heading }}
					/>
				)}
				{description && (
					<p
						className="flex-1 font-heading font-medium text-[24px] leading-[30px] text-[#fcfcfd]"
						data-directus={setAttr({ collection: 'block_cta_split', item: id, fields: 'description', mode: 'popover' })}
					>
						{description}
					</p>
				)}
			</div>
		</div>
	);
}
