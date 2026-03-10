import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
		return NextResponse.json({ error: 'Invalid file id.' }, { status: 400 });
	}

	const assetUrl = `${getDirectusAssetURL(id)}?download`;

	const upstream = await fetch(assetUrl);

	if (!upstream.ok) {
		return NextResponse.json({ error: 'File not found.' }, { status: upstream.status });
	}

	const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
	const contentDisposition =
		upstream.headers.get('content-disposition') ?? `attachment; filename="${id}.pdf"`;

	return new NextResponse(upstream.body, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': contentDisposition.includes('attachment')
				? contentDisposition
				: contentDisposition.replace('inline', 'attachment'),
		},
	});
}
