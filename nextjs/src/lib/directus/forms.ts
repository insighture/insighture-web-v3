export const submitForm = async (
	formId: string,
	fields: { id: string; name: string; type: string }[],
	data: Record<string, any>,
) => {
	const response = await fetch('/api/form-submit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ formId, fields, data }),
	});

	if (!response.ok) {
		const errBody = await response.json().catch(() => ({}));
		throw new Error(errBody.error || 'Failed to submit form');
	}
};
