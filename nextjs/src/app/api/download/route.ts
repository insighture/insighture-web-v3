import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
		return NextResponse.json({ error: 'Invalid file id.' }, { status: 400 });
	}

	const directusUrl = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

	if (!directusUrl) {
		console.error('[download] Missing DIRECTUS_URL env var');

		return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
	}

	const assetUrl = `${directusUrl}/assets/${id}?download`;

	try {
		const upstream = await fetch(assetUrl);

		if (!upstream.ok) {
			console.error(`[download] Upstream ${upstream.status} for asset ${id}`);

			return NextResponse.json({ error: 'File not found.' }, { status: upstream.status });
		}

		const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
		const upstreamDisposition = upstream.headers.get('content-disposition') ?? '';
		const contentDisposition = upstreamDisposition.includes('attachment')
			? upstreamDisposition
			: `attachment; filename="${id}.pdf"`;

		return new NextResponse(upstream.body, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': contentDisposition,
			},
		});
	} catch (err) {
		console.error('[download] Fetch error:', err);

		return NextResponse.json({ error: 'Failed to fetch file.' }, { status: 502 });
	}
}
