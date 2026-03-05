'use client';

import { setAttr } from '@directus/visual-editing';

interface AcknowledgementData {
	id: string;
	text?: string | null;
}

const Acknowledgement = ({ data }: { data: AcknowledgementData }) => {
	if (!data.text) return null;

	return (
		<div className="w-full bg-[#ebf0f2] px-8 py-10 md:px-16 md:py-10 lg:px-[120px]">
			<p
				className="font-sans font-light text-sm leading-5 text-[#1d2939]"
				data-directus={setAttr({
					collection: 'block_acknowledgement',
					item: data.id,
					fields: 'text',
					mode: 'popover',
				})}
			>
				{data.text}
			</p>
		</div>
	);
};

export default Acknowledgement;
