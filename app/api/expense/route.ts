import { NextRequest, NextResponse } from "next/server";

// ==========================
// POST: Add Expense
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/expenses/add.php",
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
        message: "Failed to add expense",
        error,
      },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Edit Expense
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/expenses/edit.php",
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
        message: "Failed to update expense",
        error,
      },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Delete Expense
// ==========================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://shikhagarments.soon.it/api/expenses/delete.php",
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
        message: "Failed to delete expense",
        error,
      },
      { status: 500 }
    );
  }
}