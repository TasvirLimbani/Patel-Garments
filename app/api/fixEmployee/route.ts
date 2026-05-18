import { NextRequest, NextResponse } from "next/server";

// ======================================================
// GET - List Employees
// ======================================================
export async function GET() {
  try {
    const res = await fetch(
      "http://shikhagarments.soon.it/api/fix_employee/list.php",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch employees",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.count,
      employees: data.data,
    });
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

// ======================================================
// POST - Add Employee
// ======================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/fix_employee/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add employee",
        error,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - Edit Employee
// ======================================================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/fix_employee/edit.php",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update employee",
        error,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE - Delete Employee
// ======================================================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/fix_employee/delete.php",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete employee",
        error,
      },
      { status: 500 }
    );
  }
}