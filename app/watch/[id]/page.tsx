'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ExternalLink, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Video, AdsterraAd, UserSession } from '@/types/database';
import { getVideoById, getSmartDirectLinks, incrementVideoViews, getUserSession, updateUserSession, incrementAdClicks } from '@/lib/api';
import Header from '@/components/layout/Header';

export default function PreWatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [smartLinks, setSmartLinks] = useState<AdsterraAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdsterraAd | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Get or create session
        let session = sessionStorage.getItem('userSession');
        if (!session) {
          session = await createUserSession();
          sessionStorage.setItem('userSession', session);
        }
        setSessionId(session);

        // Fetch video and ads
        const [videoData, adsData] = await Promise.all([
          getVideoById(videoId),
          getSmartDirectLinks()
        ]);

        if (!videoData) {
          toast.error('Video not found');
          router.push('/');
          return;
        }

        setVideo(videoData);
        setSmartLinks(adsData);

        // Check if video is already unlocked
        const userSession = await getUserSession(session);
        if (userSession?.videoId === videoId && userSession.adViewTimes[videoId]) {
          const viewTime = userSession.adViewTimes[videoId];
          if (viewTime >= 5) {
            setIsUnlocked(true);
          }
        }

        // Select random ad
        if (adsData.length > 0) {
          const randomAd = adsData[Math.floor(Math.random() * adsData.length)];
          setSelectedAd(randomAd);
        }

      } catch (error) {
        console.error('Error initializing page:', error);
        toast.error('Error loading video');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [videoId, router]);

  useEffect(() => {
    if (selectedAd && !isUnlocked) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAdComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedAd, isUnlocked]);

  const handleAdComplete = async () => {
    if (!selectedAd || !sessionId) return;

    try {
      // Track ad view time
      await updateUserSession(sessionId, {
        videoId,
        adViewTimes: {
          [videoId]: 5, // 5 seconds minimum
        },
      });

      // Increment ad clicks
      await incrementAdClicks(selectedAd.id);

      setIsUnlocked(true);
      toast.success('Video unlocked! You can now watch the video.');
    } catch (error) {
      console.error('Error completing ad:', error);
      toast.error('Error unlocking video');
    }
  };

  const handleAdClick = () => {
    if (!selectedAd) return;
    
    // Track ad click
    incrementAdClicks(selectedAd.id);
    
    // Open ad in new tab
    window.open(selectedAd.url, '_blank');
  };

  const handleWatchVideo = async () => {
    if (!video || !isUnlocked) return;

    try {
      // Increment video views
      await incrementVideoViews(video.id);
      
      // Navigate to video player
      router.push(`/player/${video.id}`);
    } catch (error) {
      console.error('Error starting video:', error);
      toast.error('Error starting video');
    }
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-primary-orange hover:text-orange-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Link>

          {/* Video Preview */}
          <div className="bg-dark-200 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Video Preview */}
              <div className="flex-shrink-0 relative">
                <div className="w-full lg:w-80 h-48 lg:h-64 bg-gradient-to-r from-primary-orange to-primary-skyblue rounded-lg flex items-center justify-center relative overflow-hidden">
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
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white bg-opacity-20 rounded-full p-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
                <p className="text-gray-300 mb-4">{video.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
                  <span className="bg-primary-skyblue text-white px-3 py-1 rounded">
                    {video.category}
                  </span>
                  <span>{video.duration}</span>
                  <span>{video.views.toLocaleString()} views</span>
                </div>

                {/* Unlock Status */}
                {isUnlocked ? (
                  <button
                    onClick={handleWatchVideo}
                    className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Video</span>
                  </button>
                ) : (
                  <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-white mb-2">Complete the ad to unlock this video</p>
                    <div className="flex items-center space-x-2 text-primary-orange">
                      <Clock className="w-4 h-4" />
                      <span>{timeRemaining} seconds remaining</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ad Section */}
          {!isUnlocked && selectedAd && (
            <div className="bg-dark-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Complete Ad to Unlock Video</h2>
              
              <div className="bg-gradient-to-r from-primary-orange to-primary-skyblue rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">{selectedAd.title}</h3>
                {selectedAd.description && (
                  <p className="text-white opacity-90 mb-4">{selectedAd.description}</p>
                )}
                
                <button
                  onClick={handleAdClick}
                  className="bg-white text-primary-orange font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Advertiser</span>
                </button>
                
                <p className="text-white text-sm mt-4 opacity-75">
                  Stay on the advertiser page for at least 5 seconds to unlock the video
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isUnlocked && (
            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-green-400 mb-2">Video Unlocked!</h3>
              <p className="text-green-300">
                You can now watch the video. Thank you for supporting our advertisers!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

async function createUserSession(): Promise<string> {
  // This would normally call the API, but for demo purposes we'll generate a local session ID
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
