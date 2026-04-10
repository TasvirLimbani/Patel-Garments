export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return new Response("Missing URL", { status: 400 });
    }

    const res = await fetch(imageUrl);

    if (!res.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Error fetching image", { status: 500 });
  }
}