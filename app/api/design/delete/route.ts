import { NextResponse } from 'next/server';

const BASE_URL = 'http://shikhagarments.soon.it/api/design';

export async function POST(req: Request) {
  try {
    // ✅ Read FormData from frontend
    const incomingForm = await req.formData();
    const id = incomingForm.get('id');

    // ✅ Create new FormData to send to PHP API
    const formData = new FormData();
    formData.append('id', String(id));

    const res = await fetch(`${BASE_URL}/delete.php`, {
      method: 'POST',
      body: formData, // ✅ send as form-data
    });

    const data = await res.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to delete design',
    });
  }
}