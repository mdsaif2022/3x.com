import { NextRequest, NextResponse } from 'next/server';
import { getVideoFiles } from '@/lib/videoManager';

export async function GET(request: NextRequest) {
  try {
    const videoFiles = await getVideoFiles();
    
    // Convert to the format expected by the frontend
    const videos = videoFiles.map((file, index) => ({
      id: `local_video_${index + 1}`,
      title: file.title,
      description: `Local video file: ${file.title}`,
      category: file.category,
      videoUrl: file.path,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
      duration: file.duration,
      views: Math.floor(Math.random() * 100000) + 1000,
      downloads: Math.floor(Math.random() * 5000) + 100,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updatedAt: new Date(),
    }));
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching local videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
