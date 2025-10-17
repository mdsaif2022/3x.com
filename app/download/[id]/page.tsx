'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ExternalLink, CheckCircle, Clock, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Video, AdsterraAd, DownloadStep } from '@/types/database';
import { getVideoById, getSmartDirectLinks, incrementVideoDownloads, getUserSession, updateUserSession, incrementAdClicks } from '@/lib/api';
import Header from '@/components/layout/Header';

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [downloadSteps, setDownloadSteps] = useState<DownloadStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [downloadToken, setDownloadToken] = useState<string>('');

  useEffect(() => {
    const initializeDownload = async () => {
      try {
        // Get or create session
        let session = sessionStorage.getItem('userSession');
        if (!session) {
          session = await createUserSession();
          sessionStorage.setItem('userSession', session);
        }
        setSessionId(session);

        // Fetch video
        const videoData = await getVideoById(videoId);
        if (!videoData) {
          toast.error('Video not found');
          router.push('/');
          return;
        }
        setVideo(videoData);

        // Check if download is already unlocked
        const userSession = await getUserSession(session);
        if (userSession?.tokens[`download_${videoId}`]) {
          const token = userSession.tokens[`download_${videoId}`];
          if (new Date(token.expires) > new Date()) {
            setIsUnlocked(true);
            setDownloadToken(token.value);
          }
        }

        // Generate download steps
        await generateDownloadSteps();

      } catch (error) {
        console.error('Error initializing download:', error);
        toast.error('Error loading download page');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDownload();
  }, [videoId, router]);

  const generateDownloadSteps = async () => {
    try {
      const smartLinks = await getSmartDirectLinks();
      
      // Create 4 steps with 2-4 random ads each
      const steps: DownloadStep[] = [];
      for (let i = 0; i < 4; i++) {
        const numAds = Math.floor(Math.random() * 3) + 2; // 2-4 ads
        const stepAds: AdsterraAd[] = [];
        
        for (let j = 0; j < numAds; j++) {
          if (smartLinks.length > 0) {
            const randomAd = smartLinks[Math.floor(Math.random() * smartLinks.length)];
            stepAds.push(randomAd);
          }
        }
        
        steps.push({
          stepNumber: i + 1,
          ads: stepAds,
          requiredTime: Math.floor(Math.random() * 6) + 5, // 5-10 seconds
          completed: false,
        });
      }
      
      setDownloadSteps(steps);
    } catch (error) {
      console.error('Error generating download steps:', error);
    }
  };

  const handleAdClick = async (ad: AdsterraAd, stepIndex: number) => {
    try {
      // Track ad click
      await incrementAdClicks(ad.id);
      
      // Open ad in new tab
      const newWindow = window.open(ad.url, '_blank');
      
      if (newWindow) {
        // Start timer for this ad
        const timer = setTimeout(async () => {
          await completeAdStep(stepIndex);
        }, downloadSteps[stepIndex].requiredTime * 1000);
        
        // Store timer reference for cleanup
        (newWindow as any).adTimer = timer;
      }
      
    } catch (error) {
      console.error('Error handling ad click:', error);
      toast.error('Error opening ad');
    }
  };

  const completeAdStep = async (stepIndex: number) => {
    try {
      const updatedSteps = [...downloadSteps];
      updatedSteps[stepIndex].completed = true;
      setDownloadSteps(updatedSteps);
      
      const updatedCompletedSteps = [...completedSteps, stepIndex];
      setCompletedSteps(updatedCompletedSteps);
      
      toast.success(`Step ${stepIndex + 1} completed!`);
      
      // Check if all steps are completed
      if (updatedCompletedSteps.length === downloadSteps.length) {
        await unlockDownload();
      }
      
    } catch (error) {
      console.error('Error completing ad step:', error);
    }
  };

  const unlockDownload = async () => {
    try {
      // Generate download token (expires in 2 minutes)
      const token = generateDownloadToken();
      const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
      
      // Update session with token
      await updateUserSession(sessionId, {
        tokens: {
          [`download_${videoId}`]: {
            value: token,
            expires,
          },
        },
      });
      
      // Increment download count
      await incrementVideoDownloads(videoId);
      
      setDownloadToken(token);
      setIsUnlocked(true);
      toast.success('Download unlocked! You have 2 minutes to download.');
      
    } catch (error) {
      console.error('Error unlocking download:', error);
      toast.error('Error unlocking download');
    }
  };

  const generateDownloadToken = (): string => {
    return `download_${videoId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleDownload = () => {
    if (!video || !downloadToken) return;
    
    // Create download link with token
    const downloadUrl = `/api/download/${videoId}?token=${downloadToken}`;
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
  };

  const getProgressPercentage = () => {
    if (downloadSteps.length === 0) return 0;
    return (completedSteps.length / downloadSteps.length) * 100;
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

          {/* Video Info */}
          <div className="bg-dark-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{video.title}</h1>
                <p className="text-gray-400">{video.category} • {video.duration}</p>
              </div>
            </div>
          </div>

          {/* Download Status */}
          {isUnlocked ? (
            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-xl p-6 text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Download Unlocked!</h2>
              <p className="text-green-300 mb-6">
                You have 2 minutes to download this video. Click the button below to start downloading.
              </p>
              <button
                onClick={handleDownload}
                className="btn-primary text-lg px-8 py-3 flex items-center space-x-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                <span>Download Video</span>
              </button>
            </div>
          ) : (
            <div className="bg-dark-200 rounded-xl p-6 mb-8">
              <div className="text-center mb-6">
                <Lock className="w-16 h-16 text-primary-orange mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Unlock Download</h2>
                <p className="text-gray-400">
                  Complete all steps below to unlock the download link
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">Progress</span>
                  <span className="text-primary-orange font-semibold">
                    {completedSteps.length} / {downloadSteps.length} steps completed
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-orange to-primary-skyblue h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Download Steps */}
              <div className="space-y-6">
                {downloadSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      completedSteps.includes(index)
                        ? 'border-green-600 bg-green-600 bg-opacity-10'
                        : 'border-gray-600 bg-dark-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {completedSteps.includes(index) ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-400">
                              {step.stepNumber}
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-white">
                          Step {step.stepNumber} of {downloadSteps.length}
                        </h3>
                      </div>
                      {completedSteps.includes(index) && (
                        <span className="text-green-400 text-sm font-semibold">Completed</span>
                      )}
                    </div>

                    <p className="text-gray-400 mb-4">
                      Click on the ads below and stay on each page for at least {step.requiredTime} seconds
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.ads.map((ad, adIndex) => (
                        <button
                          key={adIndex}
                          onClick={() => handleAdClick(ad, index)}
                          className="bg-gradient-to-r from-primary-orange to-primary-skyblue rounded-lg p-4 text-white hover:opacity-90 transition-opacity"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="font-semibold">{ad.title}</h4>
                              {ad.description && (
                                <p className="text-sm opacity-90">{ad.description}</p>
                              )}
                            </div>
                            <ExternalLink className="w-5 h-5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
