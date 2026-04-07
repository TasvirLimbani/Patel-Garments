import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://shikhagarments.soon.it/api/employee/list.php', {
      cache: 'no-store',
    });

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch employees' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      employees: data.data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error', error },
      { status: 500 }
    );
  }
}