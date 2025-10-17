const fs = require('fs');
const path = require('path');

// Function to extract title from filename
function extractTitleFromFilename(filename) {
  // Remove .mp4 extension
  let title = filename.replace('.mp4', '');
  
  // Remove XNXX_ prefix if present
  title = title.replace(/^XNXX_/, '');
  
  // Replace underscores with spaces
  title = title.replace(/_/g, ' ');
  
  // Capitalize first letter of each word
  title = title.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  return title;
}

// Function to get video category based on filename
function getVideoCategory(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('stepdad') || lowerFilename.includes('stepdaughter') || lowerFilename.includes('stepfather')) {
    return 'Family';
  } else if (lowerFilename.includes('teen') || lowerFilename.includes('young')) {
    return 'Teen';
  } else if (lowerFilename.includes('milf') || lowerFilename.includes('mature')) {
    return 'Mature';
  } else if (lowerFilename.includes('anal') || lowerFilename.includes('ass')) {
    return 'Anal';
  } else if (lowerFilename.includes('lesbian') || lowerFilename.includes('girl')) {
    return 'Lesbian';
  } else if (lowerFilename.includes('hardcore') || lowerFilename.includes('rough')) {
    return 'Hardcore';
  }
  
  return 'Entertainment';
}

// Function to generate demo video data
function generateDemoVideos() {
  const videoDir = path.join(process.cwd(), 'video');
  const demoDataPath = path.join(process.cwd(), 'data', 'demo.ts');
  
  // Check if video directory exists
  if (!fs.existsSync(videoDir)) {
    console.log('Video directory not found, skipping video generation');
    return;
  }
  
  // Read video files
  const files = fs.readdirSync(videoDir);
  const videoFiles = files.filter(file => file.endsWith('.mp4'));
  
  console.log(`Found ${videoFiles.length} video files to add to demo data`);
  
  // Generate video objects
  const demoVideos = videoFiles.map((file, index) => {
    const title = extractTitleFromFilename(file);
    const category = getVideoCategory(file);
    const videoId = `local_video_${index + 1}`;
    
    return {
      id: videoId,
      title: title,
      description: `Local video: ${title}`,
      category: category,
      videoUrl: `/videos/${encodeURIComponent(file)}`,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
      duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      views: Math.floor(Math.random() * 100000) + 1000,
      downloads: Math.floor(Math.random() * 10000) + 100,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });
  
  // Read existing demo.ts file
  let demoContent = fs.readFileSync(demoDataPath, 'utf8');
  
  // Find the end of the existing demoVideos array
  const arrayEndIndex = demoContent.lastIndexOf('];');
  
  if (arrayEndIndex === -1) {
    console.error('Could not find end of demoVideos array');
    return;
  }
  
  // Generate the new video entries
  const newVideoEntries = demoVideos.map(video => {
    return `  {
    id: '${video.id}',
    title: '${video.title}',
    description: '${video.description}',
    category: '${video.category}',
    videoUrl: '${video.videoUrl}',
    thumbnailUrl: '${video.thumbnailUrl}',
    duration: '${video.duration}',
    views: ${video.views},
    downloads: ${video.downloads},
    createdAt: new Date('${video.createdAt.toISOString()}'),
    updatedAt: new Date('${video.updatedAt.toISOString()}'),
  },`;
  }).join('\n');
  
  // Insert new videos before the closing bracket
  const updatedContent = demoContent.slice(0, arrayEndIndex) + 
    ',\n' + newVideoEntries + '\n' + 
    demoContent.slice(arrayEndIndex);
  
  // Write updated content back to file
  fs.writeFileSync(demoDataPath, updatedContent);
  
  console.log(`Successfully added ${demoVideos.length} videos to demo data`);
  console.log('Demo videos generated:');
  demoVideos.forEach((video, index) => {
    console.log(`${index + 1}. ${video.title} (${video.category})`);
  });
}

// Run the script
generateDemoVideos();
