import { NextResponse } from 'next/server';

// GET (list)
export async function GET() {
  try {
    const res = await fetch('http://shikhagarments.soon.it/api/salary/list.php', {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
