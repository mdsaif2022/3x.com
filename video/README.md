# Video Folder Management

This folder contains your local video files that will be automatically detected and served by the VideoStream Pro application.

## 📁 Folder Structure

```
video/
├── XNXX_1hj35-131_360p.mp4
├── XNXX_black_stepdad_gets_head_from_his_horny_teen_stepdaughter_who_craves_his_huge_dick_-_part_5_360p.mp4
├── XNXX_cougar_maxim_law_stepdaughter_and_bf_threesome_360p.mp4
└── ... (other video files)
```

## 🎯 How It Works

### Automatic Detection
- The application automatically scans the `/video` folder for `.mp4` files
- Video titles are generated from filenames (removing XNXX_ prefix and underscores)
- Categories are automatically assigned based on content keywords
- Thumbnails are generated using placeholder images

### Video Serving
- Videos are served through `/api/video/[filename]` endpoint
- Supports HTTP range requests for video streaming
- Proper MIME types and headers for video playback
- Security measures prevent directory traversal attacks

### Admin Management
- View all local videos in the admin panel under "Local Files" tab
- See video statistics (views, downloads)
- Access video URLs for testing
- Refresh to detect new files

## 🔧 Features

### File Processing
- **Title Generation**: Converts filenames to readable titles
- **Category Detection**: Automatically categorizes based on content
- **Thumbnail Generation**: Creates placeholder thumbnails
- **Metadata**: Generates views, downloads, and creation dates

### Security
- Only `.mp4` files are allowed
- Directory traversal protection
- Filename validation
- Secure file serving

### Performance
- HTTP range request support for streaming
- Efficient file serving
- Automatic caching headers
- Optimized for large video files

## 📊 Video Information

Each video file is processed to include:
- **ID**: Unique identifier (`local_video_1`, `local_video_2`, etc.)
- **Title**: Generated from filename
- **Description**: Auto-generated description
- **Category**: Detected from content keywords
- **Video URL**: `/api/video/[filename]`
- **Thumbnail**: Placeholder image
- **Duration**: "Unknown" (can be enhanced with metadata extraction)
- **Views**: Random number for demo purposes
- **Downloads**: Random number for demo purposes
- **Created At**: Random date within last 30 days

## 🚀 Usage

### Adding Videos
1. Simply drop `.mp4` files into the `/video` folder
2. Refresh the admin panel to see new videos
3. Videos are automatically available on the homepage

### Managing Videos
1. Go to Admin Panel → Local Files tab
2. View all detected videos
3. Click "View" to test video playback
4. Use "Refresh" to detect new files

### Video Playback
- Videos work with the pre-watch ad system
- Download unlock system works with local videos
- Full video player controls supported
- Streaming optimized for large files

## 🔄 Integration

### With Demo Data
- Local videos take priority over demo videos
- If no local videos found, falls back to demo data
- Seamless integration with existing features

### With Adsterra
- Local videos work with all ad types
- Pre-watch ads function normally
- Download unlock system works
- Analytics tracking included

## 🛠️ Technical Details

### API Endpoints
- `GET /api/videos/local` - List all local videos
- `GET /api/video/[filename]` - Serve video file with streaming support

### File Processing
- Uses Node.js `fs` module for file operations
- Automatic filename sanitization
- Content-based category detection
- Placeholder thumbnail generation

### Streaming Support
- HTTP 206 Partial Content responses
- Range request handling
- Proper Content-Range headers
- Efficient chunked delivery

## 📝 Notes

- Only `.mp4` files are supported
- Filenames are automatically sanitized
- Large files are supported with streaming
- Thumbnails are placeholder images (can be enhanced)
- Duration detection can be added with video metadata libraries

## 🔮 Future Enhancements

- **Thumbnail Generation**: Extract actual video thumbnails
- **Duration Detection**: Read video metadata for accurate duration
- **File Upload**: Web interface for uploading videos
- **Batch Processing**: Process multiple files at once
- **Video Conversion**: Support for other formats
- **Metadata Extraction**: Read video properties automatically
