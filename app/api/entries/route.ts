import { NextResponse } from 'next/server';

// GET (list)
export async function GET() {
  try {
    const res = await fetch('http://shikhagarments.soon.it/api/entries/list.php', {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

// POST (add)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch('http://shikhagarments.soon.it/api/entries/add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}