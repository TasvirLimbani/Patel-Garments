import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/design';

// 👉 GET LIST
export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/list.php`, {
      cache: 'no-store',
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to fetch design list',
    });
  }
}