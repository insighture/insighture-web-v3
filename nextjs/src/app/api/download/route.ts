import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
		return NextResponse.json({ error: 'Invalid file id.' }, { status: 400 });
	}

	const directusUrl = process.env.DIRECTUS_URL;

	if (!directusUrl) {
		console.error('[download] Missing DIRECTUS_URL env var');

		return NextResponse.json({ error: 'Server misconfiguration.'}, { status: 500 });
	}

	const assetUrl = `${directusUrl}/assets/${id}?download`;

	return NextResponse.redirect(assetUrl, { status: 302 });
}
