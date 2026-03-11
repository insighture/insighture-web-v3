'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/blocks/Button';
import { Form } from '@/components/ui/form';
import Field from './FormField';
import { buildZodSchema } from '@/lib/zodSchemaBuilder';
import type { FormField as FormFieldType } from '@/types/directus-schema';
import { setAttr } from '@directus/visual-editing';

interface DynamicFormProps {
	fields: FormFieldType[];
	onSubmit: (data: Record<string, any>, resetForm: () => void) => void;
	submitLabel: string;
	submitButtonWidth?: 'auto' | 'full';
	privacyPolicyText?: string | null;
	privacyPolicyLinkText?: string | null;
	privacyPolicyLinkUrl?: string | null;
	id: string;
	statusMessage?: { type: 'success' | 'error'; text: string } | null;
}

const DynamicForm = ({
	fields,
	onSubmit,
	submitLabel,
	submitButtonWidth = 'auto',
	privacyPolicyText,
	privacyPolicyLinkText,
	privacyPolicyLinkUrl,
	id,
	statusMessage,
}: DynamicFormProps) => {
	const [privacyAccepted, setPrivacyAccepted] = useState(false);
	const sortedFields = [...fields].sort((a, b) => (a.sort || 0) - (b.sort || 0));
	const formSchema = buildZodSchema(fields);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: fields.reduce<Record<string, any>>((defaults, field) => {
			if (!field.name) return defaults;
			switch (field.type) {
				case 'checkbox':
					defaults[field.name] = false;
					break;
				case 'checkbox_group':
					defaults[field.name] = [];
					break;
				case 'radio':
					defaults[field.name] = '';
					break;
				default:
					defaults[field.name] = '';
					break;
			}

			return defaults;
		}, {}),
	});

	const colSpan = (width: string | null | undefined) => {
		switch (width) {
			case '67': return 'col-span-6 sm:col-span-4';
			case '50': return 'col-span-6 sm:col-span-3';
			case '33': return 'col-span-6 sm:col-span-2';
			default:   return 'col-span-6';
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => onSubmit(data, () => {
					form.reset();
					setPrivacyAccepted(false);
				}))}
				className="flex flex-col gap-[32px]"
				data-directus={setAttr({
					collection: 'forms',
					item: id,
					fields: 'fields',
					mode: 'popover',
				})}
			>
				<div className="flex flex-wrap gap-[16px]">
					{sortedFields.map((field) => (
						<Field key={field.id} field={field} form={form} />
					))}
				</div>

				<div className="flex flex-col gap-[8px]">
					{privacyPolicyText && (
						<div className="flex items-center gap-[8px] px-[8px] py-[4px]">
							<input
								type="checkbox"
								id={`privacy-${id}`}
								checked={privacyAccepted}
								onChange={(e) => setPrivacyAccepted(e.target.checked)}
								className="size-4 shrink-0 cursor-pointer accent-[#ee4065]"
							/>
							<label
								htmlFor={`privacy-${id}`}
								className="text-[12px] leading-[22px] text-[#15181a] cursor-pointer font-light italic"
							>
								{privacyPolicyLinkText && privacyPolicyLinkUrl
									? privacyPolicyText.split(privacyPolicyLinkText).map((part, i, arr) =>
										i < arr.length - 1 ? (
											<span key={i}>
												{part}
												<a
													href={privacyPolicyLinkUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="underline hover:opacity-80"
												>
													{privacyPolicyLinkText}
												</a>
											</span>
										) : (
											<span key={i}>{part}</span>
										),
									)
									: privacyPolicyText}
							</label>
						</div>
					)}

					<div className="w-full">
						<div
							data-directus={setAttr({
								collection: 'forms',
								item: id,
								fields: 'submit_label',
								mode: 'popover',
							})}
						>
							<Button
								type="submit"
								label={submitLabel}
								icon="arrow"
								iconPosition="right"
								id={`submit-${id}`}
								disabled={!!privacyPolicyText && !privacyAccepted}
								className="
									bg-[#EE4065]
									hover:bg-[#d73758]
									!text-white
									rounded-[8px]
									w-full
									justify-center
									h-[48px]
									text-[16px]
									font-bold
								"
							/>
						</div>
					</div>

					{statusMessage && (
						<p
							className={`text-sm mt-200 p-2 rounded text-center ${
								statusMessage.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-200'
							}`}
						>
							{statusMessage.text}
						</p>
					)}
				</div>
			</form>
		</Form>
	);
};

export default DynamicForm;
