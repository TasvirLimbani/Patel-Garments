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

// 👉 ADD DESIGN (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const apiFormData = new FormData();

    // Text fields
    apiFormData.append('design_number', formData.get('design_number') as string);
    apiFormData.append('piece', formData.get('piece') as string);
    apiFormData.append('date', formData.get('date') as string);
    apiFormData.append('color', formData.get('color') as string);

    // File fields
    const image1 = formData.get('image1') as File;
    const image2 = formData.get('image2') as File;
    const image3 = formData.get('image3') as File;

    if (image1) apiFormData.append('image1', image1);
    if (image2) apiFormData.append('image2', image2);
    if (image3) apiFormData.append('image3', image3);

    const res = await fetch(`${BASE_URL}/add.php`, {
      method: 'POST',
      body: apiFormData,
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: 'Failed to add design',
    });
  }
}