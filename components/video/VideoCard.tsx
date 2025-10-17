'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Download, Eye, Clock } from 'lucide-react';
import { Video } from '@/types/database';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="video-card group">
      {/* Video Preview */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div className="w-full h-48 bg-gradient-to-br from-primary-orange to-primary-skyblue flex items-center justify-center relative">
          {/* Video Element for Preview */}
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            poster={video.thumbnailUrl}
            preload="metadata"
            muted
            onLoadedData={(e) => {
              // Set video to first frame for preview
              const video = e.target as HTMLVideoElement;
              video.currentTime = 1; // Show frame at 1 second
            }}
            onError={() => setImageError(true)}
          />
          
          {/* Fallback if video fails to load */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-orange to-primary-skyblue flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            {video.duration}
          </div>
          
          {/* External Link Badge */}
          {video.externalUrl && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
              External
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-primary-orange transition-colors">
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
              <span>{formatViews(video.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{formatViews(video.downloads)}</span>
            </div>
          </div>
          <span className="text-xs bg-primary-skyblue text-white px-2 py-1 rounded">
            {video.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Link
            href={`/watch/${video.id}`}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Watch Now</span>
          </Link>
          <Link
            href={`/download/${video.id}`}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
