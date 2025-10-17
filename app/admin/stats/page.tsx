'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, BarChart3, Video, DollarSign } from 'lucide-react';
import { Video as VideoType, AdsterraAd } from '@/types/database';
import { getVideos, getBannerAds, getNativeAds, getSmartDirectLinks } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminStats() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [bannerAds, setBannerAds] = useState<AdsterraAd[]>([]);
  const [nativeAds, setNativeAds] = useState<AdsterraAd[]>([]);
  const [smartLinks, setSmartLinks] = useState<AdsterraAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
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
    } finally {
      setIsLoading(false);
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
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Videos"
              value={videos.length.toString()}
              icon={<Video className="w-6 h-6" />}
              color="primary-orange"
            />
            <StatsCard
              title="Total Views"
              value={calculateTotalViews().toLocaleString()}
              icon={<Eye className="w-6 h-6" />}
              color="primary-skyblue"
            />
            <StatsCard
              title="Total Downloads"
              value={calculateTotalDownloads().toLocaleString()}
              icon={<Download className="w-6 h-6" />}
              color="green-500"
            />
            <StatsCard
              title="Ad Clicks"
              value={calculateTotalAdClicks().toLocaleString()}
              icon={<DollarSign className="w-6 h-6" />}
              color="purple-500"
            />
          </div>

          {/* Top Videos */}
          <div className="bg-dark-300 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Top Performing Videos</h3>
            <div className="space-y-3">
              {videos
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((video, index) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-primary-orange font-bold">#{index + 1}</span>
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-skyblue rounded relative overflow-hidden">
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover rounded"
                          poster={video.thumbnailUrl}
                          preload="metadata"
                          muted
                          onLoadedData={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.currentTime = 1;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{video.title}</h4>
                        <p className="text-gray-400 text-sm">{video.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{video.views.toLocaleString()} views</p>
                      <p className="text-gray-400 text-sm">{video.downloads.toLocaleString()} downloads</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
