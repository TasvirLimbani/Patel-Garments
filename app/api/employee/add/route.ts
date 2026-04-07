// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const res = await fetch('http://shikhagarments.soon.it/api/employee/add.php', {
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

    const res = await fetch('http://shikhagarments.soon.it/api/employee/add.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // ✅ SAME AS EDIT (IMPORTANT)
    return NextResponse.json({
      success: data.status,   // 👈 THIS FIXES YOUR ISSUE
      message: data.message,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}