'use client';

import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';

interface CtaSplitData {
	id: number | string;
	heading?: string | null;
	description?: string | null;
}

export default function CtaSplit({ data }: { data: CtaSplitData }) {
	const { id, heading, description } = data;

	return (
		<div className="bg-[#0b2d34] w-full pt-6 pb-8 md:pb-12">
			<Container>
				<div className="flex flex-col md:flex-row gap-6 md:gap-[50px] items-start w-full">
					{heading && (
						<div
							className="shrink-0 w-full md:w-auto lg:w-[392px] font-heading font-medium text-[28px] md:text-[36px] lg:text-[48px] leading-[1.2] lg:leading-[56px] text-[#f7f7f7] [&_em]:not-italic [&_em]:text-[#ee4065] [&_em]:font-semibold"
							data-directus={setAttr({ collection: 'block_cta_split', item: id, fields: 'heading', mode: 'popover' })}
							dangerouslySetInnerHTML={{ __html: heading }}
						/>
					)}
					{description && (
						<p
							className="flex-1 font-heading font-medium text-[18px] md:text-[20px] lg:text-[24px] leading-[26px] md:leading-[28px] lg:leading-[30px] text-[#fcfcfd]"
							data-directus={setAttr({ collection: 'block_cta_split', item: id, fields: 'description', mode: 'popover' })}
						>
							{description}
						</p>
					)}
				</div>
			</Container>
		</div>
	);
}
