import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employee_number = searchParams.get('employee_number');

    const res = await fetch(
      `http://shikhagarments.soon.it/api/employee/delete.php?employee_number=${employee_number}`,
      {
        method: 'DELETE',
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}