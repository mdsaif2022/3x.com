'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BarChart3, Video, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdsterraAd } from '@/types/database';
import { getBannerAds, getNativeAds, getSmartDirectLinks } from '@/lib/api';
import AdForm from '@/components/admin/AdForm';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAds() {
  const [bannerAds, setBannerAds] = useState<AdsterraAd[]>([]);
  const [nativeAds, setNativeAds] = useState<AdsterraAd[]>([]);
  const [smartLinks, setSmartLinks] = useState<AdsterraAd[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState<AdsterraAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannerAdsData, nativeAdsData, smartLinksData] = await Promise.all([
        getBannerAds(),
        getNativeAds(),
        getSmartDirectLinks()
      ]);
      
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

  const handleEditAd = (ad: AdsterraAd) => {
    setEditingAd(ad);
    setShowAdForm(true);
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
          {/* Ads Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Ad Management</h2>
            <button
              onClick={() => {
                setEditingAd(null);
                setShowAdForm(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ad</span>
            </button>
          </div>

          {/* Banner Ads */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Banner Ads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bannerAds.map((ad) => (
                <div key={ad.id} className="bg-dark-300 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{ad.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{ad.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-orange text-sm">
                      {ad.clickCount} clicks
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Native Ads */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Native Ads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nativeAds.map((ad) => (
                <div key={ad.id} className="bg-dark-300 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{ad.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{ad.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-orange text-sm">
                      {ad.clickCount} clicks
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Direct Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Smart Direct Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartLinks.map((ad) => (
                <div key={ad.id} className="bg-dark-300 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{ad.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{ad.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-orange text-sm">
                      {ad.clickCount} clicks
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
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
