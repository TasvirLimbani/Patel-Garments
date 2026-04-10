import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set(['shikhagarments.soon.it']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ status: false, message: 'Missing image URL' }, { status: 400 });
    }

    const remoteUrl = new URL(url);

    if (!ALLOWED_HOSTS.has(remoteUrl.hostname)) {
      return NextResponse.json({ status: false, message: 'Host not allowed' }, { status: 403 });
    }

    const remoteResponse = await fetch(remoteUrl.toString(), { cache: 'no-store' });

    if (!remoteResponse.ok || !remoteResponse.body) {
      return NextResponse.json({ status: false, message: 'Failed to load image' }, { status: 502 });
    }

    const headers = new Headers();
    const contentType = remoteResponse.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    headers.set('cache-control', remoteResponse.headers.get('cache-control') ?? 'public, max-age=3600');

    return new Response(remoteResponse.body, {
      status: remoteResponse.status,
      headers,
    });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Invalid image URL' }, { status: 400 });
  }
}