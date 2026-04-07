import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'http://shikhagarments.soon.it/api/dashboard/dashboard.php',
      {
        cache: 'no-store', // always fresh data
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}