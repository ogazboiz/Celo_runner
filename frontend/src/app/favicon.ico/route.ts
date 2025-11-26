import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Read the icon.ico file from the app directory
    const iconPath = join(process.cwd(), 'src', 'app', 'icon.ico');
    const iconBuffer = await readFile(iconPath);
    
    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new NextResponse('Not Found', { status: 404 });
  }
}

