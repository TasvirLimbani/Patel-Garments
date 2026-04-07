import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/advance';

// 👉 PUT = EDIT
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}/edit.php`, {
      method: 'POST', // your API uses POST for edit
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to update advance' });
  }
}

// 👉 DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const res = await fetch(`${BASE_URL}/delete.php?id=${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to delete advance' });
  }
}