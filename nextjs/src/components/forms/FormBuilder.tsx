'use client';

import DynamicForm from './DynamicForm';
import { submitForm } from '@/lib/directus/forms';
import { FormField } from '@/types/directus-schema';
import { cn } from '@/lib/utils';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { toast } from 'sonner';

const DEFAULT_SUCCESS_MESSAGE = 'Thank you for your submission. We will reach out to you soon.';
const DEFAULT_ERROR_MESSAGE = 'Failed to submit the form. Please try again later.';

interface FormBuilderProps {
	className?: string;
	itemId?: string;
	form: {
		id: string;
		on_success?: 'redirect' | 'message' | null;
		sort?: number | null;
		submit_label?: string;
		submit_button_width?: 'auto' | 'full' | null;
		success_message?: string | null;
		error_message?: string | null;
		title?: string | null;
		show_title?: boolean | null;
		intro_paragraph?: string | null;
		privacy_policy_text?: string | null;
		privacy_policy_link_text?: string | null;
		privacy_policy_link_url?: string | null;
		success_redirect_url?: string | null;
		is_active?: boolean | null;
		fields: FormField[];
	};
}

const FormBuilder = ({ form, className }: FormBuilderProps) => {
	const { getToken } = useRecaptcha();

	if (!form.is_active) return null;

	const handleSubmit = async (data: Record<string, any>, resetForm: () => void) => {
		try {
			const fieldsWithNames = form.fields.map((field) => ({
				id: field.id,
				name: field.name || '',
				type: field.type || '',
			}));

			// Save submission to Directus
			await submitForm(form.id, fieldsWithNames, data);

			// Show success and reset form immediately after Directus save
			if (form.on_success === 'redirect' && form.success_redirect_url) {
				window.location.href = form.success_redirect_url;
				
				return;
			}

			toast.success(form.success_message || DEFAULT_SUCCESS_MESSAGE);
			resetForm();

			// Send email notification via SendGrid (fire-and-forget, don't block user)
			try {
				const recaptchaToken = await getToken('contact_form');
				const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
				const emailFields = form.fields
					.filter((field) => data[field.name || ''] !== undefined && data[field.name || ''] !== null)
					.map((field) => ({
						label: field.label || field.name || '',
						value: String(data[field.name || ''] ?? ''),
					}));

				await fetch(`${directusUrl}/sendgrid/send`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						subject: `New Submission: ${form.title || 'Contact Form'}`,
						fields: emailFields,
						recaptchaToken,
					}),
				});
			} catch (emailErr) {
				console.error('SendGrid email failed (submission was saved):', emailErr);
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			toast.error(form.error_message || DEFAULT_ERROR_MESSAGE);
		}
	};

	return (
		<div className={cn('bg-white p-4 sm:p-8 rounded-lg', className)}>
			{form.show_title !== false && form.title && (
				<h3 className="text-lg sm:text-xl font-semibold mb-4">{form.title}</h3>
			)}

			{form.intro_paragraph && (
				<p className="text-base sm:text-lg text-gray-600">{form.intro_paragraph}</p>
			)}

			<DynamicForm
				fields={form.fields}
				onSubmit={handleSubmit}
				submitLabel={form.submit_label || 'Submit'}
				submitButtonWidth={form.submit_button_width ?? 'auto'}
				privacyPolicyText={form.privacy_policy_text ?? null}
				privacyPolicyLinkText={form.privacy_policy_link_text ?? null}
				privacyPolicyLinkUrl={form.privacy_policy_link_url ?? null}
				id={form.id}
			/>
		</div>
	);
};

export default FormBuilder;
