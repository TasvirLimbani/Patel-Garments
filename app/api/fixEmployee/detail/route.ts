import { NextRequest, NextResponse } from "next/server";

// ======================================================
// GET - Single Employee Details
// ======================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!id || !month || !year) {
      return NextResponse.json(
        {
          success: false,
          message: "id, month and year are required",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://shikhagarments.soon.it/api/fix_employee/get.php?id=${id}&month=${month}&year=${year}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch employee",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error,
      },
      { status: 500 }
    );
  }
}