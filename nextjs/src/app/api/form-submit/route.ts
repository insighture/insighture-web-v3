import type { FormSubmission, FormSubmissionValue, Schema } from '@/types/directus-schema';
import { createDirectus, createItem, rest, withToken } from '@directus/sdk';
import { NextRequest, NextResponse } from 'next/server';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL as string;
const TOKEN = process.env.DIRECTUS_FORM_TOKEN as string;

const directus = createDirectus<Schema>(directusUrl).with(rest());

export async function POST(request: NextRequest) {
	if (!TOKEN) {
		return NextResponse.json({ error: 'Form token not configured.' }, { status: 500 });
	}

	try {
		const { formId, fields, data } = await request.json();

		if (!formId || !fields || !data) {
			return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
		}

		const submissionValues: Omit<FormSubmissionValue, 'id'>[] = [];

		for (const field of fields) {
			const value = data[field.name];
			if (value === undefined || value === null) continue;

			submissionValues.push({
				field: field.id,
				value: value.toString(),
			});
		}

		const payload = {
			form: formId,
			values: submissionValues,
		};

		await directus.request(
			withToken(TOKEN, createItem('form_submissions', payload as Omit<FormSubmission, 'id'>))
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Form submission error:', error);
		
		return NextResponse.json({ error: 'Failed to submit form.' }, { status: 500 });
	}
}
