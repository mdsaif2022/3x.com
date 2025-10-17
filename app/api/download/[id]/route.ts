import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;
    const token = request.nextUrl.searchParams.get('token');
    const sessionId = request.headers.get('x-session-id') || '';

    if (!token || !sessionId) {
      return NextResponse.json(
        { error: 'Missing token or session ID' },
        { status: 400 }
      );
    }

    // Verify session and token
    const session = await getUserSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const downloadToken = session.tokens[`download_${videoId}`];
    if (!downloadToken || downloadToken.value !== token) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (new Date(downloadToken.expires) < new Date()) {
      return NextResponse.json(
        { error: 'Download token expired' },
        { status: 401 }
      );
    }

    // For demo purposes, return a sample video URL
    // In production, this would serve the actual video file
    const videoUrl = `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`;
    
    return NextResponse.redirect(videoUrl);

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
