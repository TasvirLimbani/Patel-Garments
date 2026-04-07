import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/advance';

// 👉 GET = LIST
export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/list.php`, {
      cache: 'no-store',
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch advances' });
  }
}

// 👉 POST = ADD
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}/add.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to add advance' });
  }
}