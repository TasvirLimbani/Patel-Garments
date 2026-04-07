export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body); // debug

    const formData = new URLSearchParams();
    formData.append("email", body.email);
    formData.append("password", body.password);

    const res = await fetch(
      "http://shikhagarments.soon.it/api/auth/login.php",
      {
        method: "POST",
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      }
    );

    const data = await res.json();
    console.log("STEP 1: API HIT");


    console.log("PHP RESPONSE:", data); // debug

    return Response.json(data);
  } catch (error) {
    console.error("ERROR:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}