export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_KEY;
  const formData = await request.formData();

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const data = await res.json();
  return Response.json(data);
}
