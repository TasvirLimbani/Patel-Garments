// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const res = await fetch('http://shikhagarments.soon.it/api/employee/edit.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch('http://shikhagarments.soon.it/api/employee/edit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // ✅ Normalize response
    return NextResponse.json({
      success: data.status,   // 👈 convert status → success
      message: data.message,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}