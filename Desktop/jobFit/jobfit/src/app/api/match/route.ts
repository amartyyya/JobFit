import fetch from 'node-fetch';

export async function POST(req: Request) {
  const formData = await req.formData()
  
  const response = await fetch('http://localhost:3001/api/match', {
    method: 'POST',
    body: formData as any,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Backend error:', errorText);
    return new Response(JSON.stringify({ error: 'Failed to process resume', details: errorText }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}