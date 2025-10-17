const fs = require('fs');
const path = require('path');

// Copy video files from /video to /public/videos
function copyVideos() {
  const videoDir = path.join(process.cwd(), 'video');
  const publicVideoDir = path.join(process.cwd(), 'public', 'videos');
  
  // Create public/videos directory if it doesn't exist
  if (!fs.existsSync(publicVideoDir)) {
    fs.mkdirSync(publicVideoDir, { recursive: true });
  }
  
  // Check if video directory exists
  if (!fs.existsSync(videoDir)) {
    console.log('Video directory not found, skipping video copy');
    return;
  }
  
  // Read video files
  const files = fs.readdirSync(videoDir);
  const videoFiles = files.filter(file => file.endsWith('.mp4'));
  
  console.log(`Found ${videoFiles.length} video files to copy`);
  
  // Copy each video file
  videoFiles.forEach(file => {
    const sourcePath = path.join(videoDir, file);
    const destPath = path.join(publicVideoDir, file);
    
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file}`);
    } catch (error) {
      console.error(`Error copying ${file}:`, error);
    }
  });
  
  console.log('Video copy completed');
}

copyVideos();
