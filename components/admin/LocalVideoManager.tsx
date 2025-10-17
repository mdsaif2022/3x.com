'use client';

import { useState, useEffect } from 'react';
import { Video, Trash2, Eye, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface LocalVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function LocalVideoManager() {
  const [localVideos, setLocalVideos] = useState<LocalVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLocalVideos();
  }, []);

  const fetchLocalVideos = async () => {
    try {
      const response = await fetch('/api/videos/local');
      if (response.ok) {
        const videos = await response.json();
        setLocalVideos(videos);
      } else {
        toast.error('Failed to fetch local videos');
      }
    } catch (error) {
      console.error('Error fetching local videos:', error);
      toast.error('Error loading local videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLocalVideos();
    setRefreshing(false);
    toast.success('Videos refreshed');
  };

  const handleDeleteVideo = async (videoId: string, filename: string) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        // Note: In a real implementation, you'd need a delete API endpoint
        toast.success('Video deletion would be implemented here');
        // For now, just refresh the list
        await fetchLocalVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Error deleting video');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Local Video Files</h2>
          <p className="text-gray-400 mt-1">
            Manage videos stored in the /video folder ({localVideos.length} files)
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Videos Grid */}
      {localVideos.length === 0 ? (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Local Videos Found</h3>
          <p className="text-gray-400">
            Add .mp4 files to the /video folder to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localVideos.map((video) => (
            <div key={video.id} className="bg-dark-200 rounded-xl p-6">
              {/* Video Preview */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <div className="w-full h-32 bg-gradient-to-br from-primary-orange to-primary-skyblue flex items-center justify-center relative">
                  {/* Video Element for Preview */}
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover rounded-lg"
                    poster={video.thumbnailUrl}
                    preload="metadata"
                    muted
                    onLoadedData={(e) => {
                      // Set video to first frame for preview
                      const video = e.target as HTMLVideoElement;
                      video.currentTime = 1; // Show frame at 1 second
                    }}
                  />
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2">
                  {video.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{video.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="bg-primary-skyblue text-white px-2 py-1 rounded text-xs">
                    {video.category}
                  </span>
                </div>

                {/* Video URL */}
                <div className="bg-dark-300 rounded p-2">
                  <p className="text-xs text-gray-400 mb-1">Video URL:</p>
                  <p className="text-xs text-primary-orange break-all">
                    {video.videoUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-sm py-2 text-center"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    View
                  </a>
                  <button
                    onClick={() => handleDeleteVideo(video.id, video.title)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Local Video Management</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Videos are automatically detected from the /video folder</li>
          <li>• Only .mp4 files are supported</li>
          <li>• Videos are served through the API with proper streaming support</li>
          <li>• Thumbnails are generated automatically using placeholder images</li>
          <li>• File names are automatically converted to readable titles</li>
        </ul>
      </div>
    </div>
  );
}
