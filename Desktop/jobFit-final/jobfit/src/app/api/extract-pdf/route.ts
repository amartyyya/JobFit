
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('resume') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Save the file temporarily
  const tempFilePath = path.join('/tmp', `${Date.now()}_${file.name}`);
  try {
    await writeFile(tempFilePath, buffer);

    const pythonProcess = spawn('python3', ['process_resume.py', tempFilePath]);

    let result = '';

    // Capture the output from the Python process
    pythonProcess.stdout.on('data', (chunk) => {
      result += chunk.toString();
    });

    // Return the result once the process is done
    const response = await new Promise<NextResponse>((resolve) => {
      pythonProcess.on('close', async (code) => {
        await unlink(tempFilePath).catch(() => null); // Clean up temporary file

        if (code !== 0) {
          resolve(NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ text: result }));
        }
      });
    });

    return response;
  } catch {
    await unlink(tempFilePath).catch(() => null); // Clean up on error
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
