// import fetch from 'node-fetch';

// export async function POST(req: Request) {
//   const formData = await req.formData()
  
//   const response = await fetch('http://localhost:3001/api/match', {
//     method: 'POST',
//     body: formData as any,
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error('Backend error:', errorText);
//     return new Response(JSON.stringify({ error: 'Failed to process resume', details: errorText }), {
//       status: response.status,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   const data = await response.json();
//   return new Response(JSON.stringify(data), {
//     headers: { 'Content-Type': 'application/json' },
//   });
// } import fetch from 'node-fetch';

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume text or job description' }, { status: 400 });
    }

    const prompt = `Match the following resume with this job description and provide suggestions:
    
    Resume: ${resumeText}
    
    Job Description: ${jobDescription}`;

    const result = await model.generateContent([prompt]);

    return NextResponse.json({
      result: result.response.text(),
    });
  } catch (err) {
    console.error('Error occurred:', err);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}

