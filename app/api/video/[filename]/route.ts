import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    
    // Security: Only allow .mp4 files
    if (!filename.endsWith('.mp4')) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    // Try to serve local video files
    const videoPath = path.join(process.cwd(), 'video', filename);
    
    // Check if file exists
    try {
      await fs.access(videoPath);
    } catch {
      console.error(`Video file not found: ${videoPath}`);
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Get file stats
    const stats = await fs.stat(videoPath);
    const fileSize = stats.size;
    
    // Get range header for video streaming
    const range = request.headers.get('range');
    
    if (range) {
      // Parse range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      // Create read stream for the range
      const file = await fs.readFile(videoPath);
      const chunk = file.subarray(start, end + 1);
      
      return new NextResponse(chunk as BodyInit, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else {
      // Return full video
      const file = await fs.readFile(videoPath);
      
      return new NextResponse(file as BodyInit, {
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
  } catch (error) {
    console.error('Video serving error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
