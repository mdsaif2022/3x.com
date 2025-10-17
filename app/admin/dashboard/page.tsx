'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download, BarChart3, Video, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { Video as VideoType, AdsterraAd } from '@/types/database';
import { getVideos, getBannerAds, getNativeAds, getSmartDirectLinks, deleteVideoById } from '@/lib/api';
import VideoForm from '@/components/admin/VideoForm';
import AdForm from '@/components/admin/AdForm';
import StatsCard from '@/components/admin/StatsCard';
import LocalVideoManager from '@/components/admin/LocalVideoManager';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'videos' | 'local-videos' | 'ads' | 'stats'>('videos');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [bannerAds, setBannerAds] = useState<AdsterraAd[]>([]);
  const [nativeAds, setNativeAds] = useState<AdsterraAd[]>([]);
  const [smartLinks, setSmartLinks] = useState<AdsterraAd[]>([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [editingAd, setEditingAd] = useState<AdsterraAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Listen for video updates
    const handleVideoUpdate = () => {
      fetchData();
    };
    
    window.addEventListener('videoUpdated', handleVideoUpdate);
    
    return () => {
      window.removeEventListener('videoUpdated', handleVideoUpdate);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [videosData, bannerAdsData, nativeAdsData, smartLinksData] = await Promise.all([
        getVideos(),
        getBannerAds(),
        getNativeAds(),
        getSmartDirectLinks()
      ]);
      
      setVideos(videosData);
      setBannerAds(bannerAdsData);
      setNativeAds(nativeAdsData);
      setSmartLinks(smartLinksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVideo = (video: VideoType) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleEditAd = (ad: AdsterraAd) => {
    setEditingAd(ad);
    setShowAdForm(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const success = await deleteVideoById(videoId);
        if (success) {
          toast.success('Video deleted successfully');
          fetchData();
        } else {
          toast.error('Failed to delete video');
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Error deleting video');
      }
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        // Implement delete ad API call
        toast.success('Ad deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting ad:', error);
        toast.error('Error deleting ad');
      }
    }
  };

  const calculateTotalViews = () => {
    return videos.reduce((total, video) => total + video.views, 0);
  };

  const calculateTotalDownloads = () => {
    return videos.reduce((total, video) => total + video.downloads, 0);
  };

  const calculateTotalAdClicks = () => {
    const allAds = [...bannerAds, ...nativeAds, ...smartLinks];
    return allAds.reduce((total, ad) => total + ad.clickCount, 0);
  };

  if (isLoading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
          </div>
        </AdminLayout>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Videos Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Video Management</h2>
            <button
              onClick={() => {
                setEditingVideo(null);
                setShowVideoForm(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </button>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-dark-300 rounded-xl p-6">
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
                
                <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditVideo(video)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {showVideoForm && (
          <VideoForm
            video={editingVideo}
            onClose={() => {
              setShowVideoForm(false);
              setEditingVideo(null);
            }}
            onSave={() => {
              setShowVideoForm(false);
              setEditingVideo(null);
              fetchData();
            }}
          />
        )}

        {showAdForm && (
          <AdForm
            ad={editingAd}
            onClose={() => {
              setShowAdForm(false);
              setEditingAd(null);
            }}
            onSave={() => {
              setShowAdForm(false);
              setEditingAd(null);
              fetchData();
            }}
          />
        )}
      </AdminLayout>
    </AdminAuthGuard>
  );
}
