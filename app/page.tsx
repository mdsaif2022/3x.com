'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Download, Eye, Clock } from 'lucide-react';
import { Video, AdsterraAd } from '@/types/database';
import { getVideos, getBannerAds, getNativeAds } from '@/lib/api';
import BannerAd from '@/components/ads/BannerAd';
import NativeAd from '@/components/ads/NativeAd';
import VideoCard from '@/components/video/VideoCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [bannerAds, setBannerAds] = useState<AdsterraAd[]>([]);
  const [nativeAds, setNativeAds] = useState<AdsterraAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosData, bannerAdsData, nativeAdsData] = await Promise.all([
          getVideos(),
          getBannerAds(),
          getNativeAds()
        ]);
        
        setVideos(videosData);
        setBannerAds(bannerAdsData);
        setNativeAds(nativeAdsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Listen for storage changes to refresh videos when new ones are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'uploadedVideos') {
        fetchData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleVideoUpdate = () => {
      fetchData();
    };
    
    window.addEventListener('videoUpdated', handleVideoUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('videoUpdated', handleVideoUpdate);
    };
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Header />
      
      {/* Top Banner Ad */}
      {bannerAds.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <BannerAd ad={bannerAds[0]} />
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-orange to-primary-skyblue bg-clip-text text-transparent mb-4">
            Premium Video Streaming
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch and download exclusive videos with our integrated ad monetization platform
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <div key={video.id}>
              <VideoCard video={video} />
              
              {/* Native Ad between videos */}
              {index > 0 && index % 3 === 0 && nativeAds.length > 0 && (
                <div className="mt-6">
                  <NativeAd ad={nativeAds[index % nativeAds.length]} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner Ad */}
        {bannerAds.length > 1 && (
          <div className="mt-12">
            <BannerAd ad={bannerAds[1]} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
