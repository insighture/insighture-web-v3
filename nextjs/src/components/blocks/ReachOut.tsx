'use client';

import DirectusImage from '@/components/shared/DirectusImage';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { setAttr } from '@directus/visual-editing';
import FormBuilder from '@/components/forms/FormBuilder';
import { FormField } from '@/types/directus-schema';
import Container from '../ui/container';

interface ReachOutContactItem {
	id: number | string;
	sort?: number | null;
	label?: string | null;
	value?: string | null;
	description?: string | null;
}

interface ReachOutForm {
	id: string;
	on_success?: 'redirect' | 'message' | null;
	submit_label?: string | null;
	success_message?: string | null;
	error_message?: string | null;
	title?: string | null;
	success_redirect_url?: string | null;
	is_active?: boolean | null;
	fields: FormField[];
}

interface ReachOutProps {
	data: {
		id: number | string;
		form?: ReachOutForm | null;
		heading?: string | null;
		brochure_title?: string | null;
		brochure_image?: string | null;
		brochure_pdf?: string | null;
		brochure_download_label?: string | null;
		inquiries_heading?: string | null;
		contact_items?: ReachOutContactItem[];
	};
}

export default function ReachOut({ data }: ReachOutProps) {
	const {
		id,
		form,
		heading,
		brochure_title,
		brochure_image,
		brochure_pdf,
		brochure_download_label,
		inquiries_heading,
		contact_items,
	} = data;

	const sortedContactItems = contact_items
		? [...contact_items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
		: [];

	const pdfUrl = brochure_pdf ? getDirectusAssetURL(brochure_pdf) : null;

	const sidebar = (
		<div className="flex flex-col gap-[24px] py-[24px] pr-[24px]">
			{heading && (
				<div className="px-[24px]">
					<h2
						className="font-heading font-semibold text-[24px] leading-[40px] text-[#15181a]"
						data-directus={setAttr({ collection: 'block_reach_out', item: id, fields: 'heading', mode: 'popover' })}
					>
						{heading}
					</h2>
				</div>
			)}

			{(brochure_image || brochure_title) && (
				<div
					className="relative h-[168px] w-full"
					data-directus={setAttr({ collection: 'block_reach_out', item: id, fields: ['brochure_title', 'brochure_image', 'brochure_pdf', 'brochure_download_label'], mode: 'popover' })}
				>
					<div className="absolute inset-y-0 left-[24px] right-0 bg-[#f9fafb] rounded-[8px]" />
					<div className="absolute inset-x-0 top-[24px] flex gap-[24px] items-center">
						{brochure_image && (
							<div className="relative shrink-0 w-[200px] h-[120px] rounded-r-[8px] overflow-hidden">
								<DirectusImage
									uuid={brochure_image}
									alt={brochure_title ?? 'Brochure'}
									fill
									sizes="200px"
									className="object-cover"
								/>
							</div>
						)}
						<div className="flex flex-col gap-[48px] flex-1 min-w-0">
							{brochure_title && (
								<p className="font-heading font-semibold text-[18px] leading-[24px] text-[#15181a]">
									{brochure_title}
								</p>
							)}
							{pdfUrl && (
								<a
									href={pdfUrl}
									target="_blank"
									rel="noopener noreferrer"
									download
									className="inline-flex items-center gap-[16px] text-[14px] font-sans font-normal leading-[24px] text-[#15181a] hover:opacity-75 transition-opacity"
								>
									<span>{brochure_download_label ?? 'Download PDF'}</span>
									<svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true" className="shrink-0">
										<path d="M1 1L6 6L1 11" stroke="#15181a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</a>
							)}
						</div>
					</div>
				</div>
			)}

			{(inquiries_heading || sortedContactItems.length > 0) && (
				<div
					className="pl-[24px] flex flex-col gap-[16px]"
					data-directus={setAttr({ collection: 'block_reach_out', item: id, fields: ['inquiries_heading', 'contact_items'], mode: 'popover' })}
				>
					{inquiries_heading && (
						<h3 className="font-heading font-semibold text-[18px] leading-[24px] text-[#15181a]">
							{inquiries_heading}
						</h3>
					)}
					{sortedContactItems.length > 0 && (
						<div className="flex flex-col gap-[20px]">
							{sortedContactItems.map((item) => (
								<div key={item.id} className="flex flex-col gap-[2px] text-[14px] leading-[20px] text-[#15181a]">
									{item.label && <span className="font-sans font-normal">{item.label}</span>}
									{item.value && <span className="font-sans font-normal">{item.value}</span>}
									{item.description && <span className="font-sans font-light">{item.description}</span>}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);

	if (form) {
		return (
			<Container>
				<div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[64px] items-start py-16">
					<div
						className="w-full lg:flex-1"
						data-directus={setAttr({ collection: 'block_reach_out', item: id, fields: 'form', mode: 'popover' })}
					>
						<FormBuilder form={form as any} className="!p-0" />
					</div>
					<div className="w-full lg:w-[440px] shrink-0 bg-[#ebf0f2] rounded-[8px]">
						{sidebar}
					</div>
				</div>
			</Container>
		);
	}

	return (
		<div className="flex justify-center">
			{sidebar}
		</div>
	);
}
