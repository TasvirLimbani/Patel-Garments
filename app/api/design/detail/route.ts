import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/design';

// 👉 GET DETAIL
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const design_no = searchParams.get('design_no');

    const res = await fetch(`${BASE_URL}/get.php?design_no=${design_no}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to fetch design detail',
    });
  }
}