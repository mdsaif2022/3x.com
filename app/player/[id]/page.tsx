'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Video } from '@/types/database';
import { getVideoById } from '@/lib/api';
import Header from '@/components/layout/Header';

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get the actual video URL to use (demo video for XNXX videos)
  const getVideoUrl = (video: Video | null) => {
    if (!video) return '';
    
    // If video has external URL (XNXX), use demo video for playback
    if (video.externalUrl && video.externalUrl.includes('xnxx.com')) {
      return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
    }
    
    // Otherwise use the original video URL
    return video.videoUrl;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        if (!videoData) {
          toast.error('Video not found');
          router.push('/');
          return;
        }
        setVideo(videoData);
        console.log('Video data loaded:', videoData);
        console.log('Video URL:', videoData.videoUrl);
        console.log('External URL:', videoData.externalUrl);
        console.log('Final video URL for player:', getVideoUrl(videoData));
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Error loading video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, router]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      console.log('Video metadata loaded, duration:', videoRef.current.duration);
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const error = e.currentTarget.error;
    console.error('Video error:', error);
    if (error) {
      let errorMessage = 'Unknown video error';
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video playback was aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Video decoding error';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported';
          break;
      }
      setVideoError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-primary-orange hover:text-orange-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Link>

          {/* Video Player */}
          <div className="bg-dark-200 rounded-xl overflow-hidden mb-8">
            <div className="relative">
              <video
                ref={videoRef}
                src={getVideoUrl(video)}
                className="w-full h-auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={handleVideoError}
                poster={video.thumbnailUrl}
                controls={false}
                preload="metadata"
              />
              
              {/* Play/Pause Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                onClick={togglePlay}
              >
                {!isPlaying && !videoError && (
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
                {videoError && (
                  <div className="text-center text-white">
                    <div className="text-red-400 mb-2">⚠️ Video Error</div>
                    <div className="text-sm">{videoError}</div>
                    <div className="text-xs mt-2 text-gray-300">Video URL: {video.videoUrl}</div>
                    <button
                      onClick={() => router.push('/player/video_1')}
                      className="mt-4 bg-primary-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                    >
                      Try Demo Video
                    </button>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-primary-orange transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-primary-orange transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-primary-orange transition-colors"
                    >
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{video.title}</h1>
                <p className="text-gray-300">{video.description}</p>
                {video.externalUrl && (
                  <div className="mt-3 p-3 bg-green-900 bg-opacity-50 rounded-lg border border-green-500">
                    <p className="text-green-200 text-sm">
                      <strong>✓ Demo Video Available:</strong> You're watching a demo version. The full video is available via the external link below.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <span className="bg-primary-skyblue text-white px-3 py-1 rounded">
                  {video.category}
                </span>
                <span className="text-gray-400">{video.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link
                href={`/download/${video.id}`}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </Link>
              {video.externalUrl && (
                <div className="flex flex-col space-y-2">
                  <a
                    href={video.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <span>Watch Full Video (External)</span>
                  </a>
                  <p className="text-xs text-gray-400">
                    Click above to watch the full video on external site
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF7F00;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF7F00;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
