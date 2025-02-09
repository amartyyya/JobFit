import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get('resume') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save the file temporarily
  const tempFilePath = path.join('/tmp', `${Date.now()}_${file.name}`);
  try {
    await writeFile(tempFilePath, buffer);

    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', ['process_resume.py', tempFilePath]);

      let result = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        // You can handle error logging or message here
        console.error(data.toString());
      });

      pythonProcess.on('close', async (code) => {
        // Clean up the temporary file
        await unlink(tempFilePath).catch(() => null);

        if (code !== 0) {
          resolve(NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ text: result }));
        }
      });
    });
  } catch (err) {
    await unlink(tempFilePath).catch(() => null); // Clean up in case of errors
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
