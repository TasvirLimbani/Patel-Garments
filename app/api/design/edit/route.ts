import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/design';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Directly forward formData to PHP API
    const res = await fetch(`${BASE_URL}/edit.php`, {
      method: 'POST',
      body: formData, // ✅ IMPORTANT (no JSON)
    });

    const data = await res.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('EDIT ERROR:', error);
    return NextResponse.json({
      status: false,
      message: 'Edit failed',
    });
  }
}