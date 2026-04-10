import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // دریافت form-data
    const formData = await req.formData();

    const design_no = formData.get("design_no") as string;
    const image = formData.get("image") as File;

    if (!design_no || !image) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Create new FormData to send to external API
    const uploadData = new FormData();
    uploadData.append("design_no", design_no);
    uploadData.append("image", image);

    // Call your PHP API
    const response = await fetch(
      "http://shikhagarments.soon.it/api/design/uploadimage.php",
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}