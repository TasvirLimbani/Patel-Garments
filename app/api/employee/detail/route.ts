import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      'http://shikhagarments.soon.it/api/employee/get.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_number: body.employee_number,
          month_year: body.month_year, // ✅ ADD THIS
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: false, message: 'API error' },
      { status: 500 }
    );
  }
}