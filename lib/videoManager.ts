// Video file management and serving
import { promises as fs } from 'fs';
import path from 'path';

export interface VideoFile {
  filename: string;
  title: string;
  category: string;
  duration: string;
  size: number;
  path: string;
}

// Video categories based on content
export const VIDEO_CATEGORIES = {
  'Entertainment': 'Entertainment',
  'Education': 'Education', 
  'Gaming': 'Gaming',
  'Music': 'Music',
  'Sports': 'Sports',
  'Technology': 'Technology',
  'Adult': 'Adult'
};

// Extract title from filename
export function extractTitleFromFilename(filename: string): string {
  // Remove XNXX_ prefix and file extension
  let title = filename.replace(/^XNXX_/, '').replace(/\.mp4$/, '');
  
  // Replace underscores with spaces
  title = title.replace(/_/g, ' ');
  
  // Capitalize first letter of each word
  title = title.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  // Limit length
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title;
}

// Get video category based on content
export function getVideoCategory(filename: string): string {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('step') || lowerFilename.includes('dad') || lowerFilename.includes('teen')) {
    return 'Adult';
  }
  
  // Add more category detection logic here
  return 'Entertainment';
}

// Get video files from directory
export async function getVideoFiles(): Promise<VideoFile[]> {
  try {
    // Try public/videos directory first (for Vercel deployment)
    const publicVideoDir = path.join(process.cwd(), 'public', 'videos');
    const localVideoDir = path.join(process.cwd(), 'video');
    
    let videoDir = publicVideoDir;
    let videoPath = '/videos/';
    
    // Check if public/videos exists, otherwise use local video directory
    try {
      await fs.access(publicVideoDir);
      console.log('Using public/videos directory');
    } catch {
      try {
        await fs.access(localVideoDir);
        videoDir = localVideoDir;
        videoPath = '/api/video/';
        console.log('Using local video directory');
      } catch {
        console.warn('No video directory found, returning empty array');
        return [];
      }
    }
    
    const files = await fs.readdir(videoDir);
    
    const videoFiles: VideoFile[] = [];
    
    for (const file of files) {
      if (file.endsWith('.mp4')) {
        const filePath = path.join(videoDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          videoFiles.push({
            filename: file,
            title: extractTitleFromFilename(file),
            category: getVideoCategory(file),
            duration: 'Unknown', // You can add duration detection later
            size: stats.size,
            path: `${videoPath}${encodeURIComponent(file)}`
          });
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    }
    
    console.log(`Found ${videoFiles.length} video files in ${videoDir}`);
    return videoFiles;
  } catch (error) {
    console.error('Error reading video files:', error);
    return [];
  }
}

// Get video files for development (always try to read local files)
export async function getVideoFilesForDevelopment(): Promise<VideoFile[]> {
  try {
    const videoDir = path.join(process.cwd(), 'video');
    
    // Check if video directory exists
    try {
      await fs.access(videoDir);
    } catch {
      console.warn('Video directory not found, returning empty array');
      return [];
    }
    
    const files = await fs.readdir(videoDir);
    
    const videoFiles: VideoFile[] = [];
    
    for (const file of files) {
      if (file.endsWith('.mp4')) {
        const filePath = path.join(videoDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          videoFiles.push({
            filename: file,
            title: extractTitleFromFilename(file),
            category: getVideoCategory(file),
            duration: 'Unknown', // You can add duration detection later
            size: stats.size,
            path: `/api/video/${encodeURIComponent(file)}`
          });
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    }
    
    console.log(`Found ${videoFiles.length} video files`);
    return videoFiles;
  } catch (error) {
    console.error('Error reading video files:', error);
    return [];
  }
}

// Generate thumbnail path
export function getThumbnailPath(videoPath: string): string {
  // For now, return a placeholder thumbnail
  // In production, you'd generate actual thumbnails
  return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=300&fit=crop`;
}
