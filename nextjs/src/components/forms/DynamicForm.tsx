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
	onSubmit: (data: Record<string, any>) => void;
	submitLabel: string;
	submitButtonWidth?: 'auto' | 'full';
	privacyPolicyText?: string | null;
	privacyPolicyLinkText?: string | null;
	privacyPolicyLinkUrl?: string | null;
	id: string;
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
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-6 gap-4"
				data-directus={setAttr({
					collection: 'forms',
					item: id,
					fields: 'fields',
					mode: 'popover',
				})}
			>
				{sortedFields.map((field) => (
					<div key={field.id} className={colSpan(field.width)}>
						<Field key={field.id} field={field} form={form} />
					</div>
				))}
				{privacyPolicyText && (
					<div className="col-span-6 flex items-start gap-3">
						<input
							type="checkbox"
							id={`privacy-${id}`}
							checked={privacyAccepted}
							onChange={(e) => setPrivacyAccepted(e.target.checked)}
							className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#ee4065]"
						/>
						<label htmlFor={`privacy-${id}`} className="text-sm text-gray-600 cursor-pointer leading-snug italic">
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

				<div className={submitButtonWidth === 'full' ? 'col-span-6' : 'col-span-6 sm:col-span-3 md:col-span-2'}>
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
							className={`
								bg-[#EE4065]
								hover:bg-[#d73758]
								text-white
								rounded-lg
								${submitButtonWidth === 'full' ? 'w-full justify-center' : ''}
							`}
						/>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default DynamicForm;
