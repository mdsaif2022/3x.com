'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, BarChart3, Video, DollarSign, FileVideo } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'local-videos' | 'ads' | 'stats'>('videos');
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const getActiveTab = () => {
    // Determine active tab based on current route
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/admin/stats')) return 'stats';
      if (path.includes('/admin/ads')) return 'ads';
      if (path.includes('/admin/local-videos')) return 'local-videos';
      return 'videos';
    }
    return activeTab;
  };

  const currentTab = getActiveTab();

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Admin Header */}
      <div className="bg-dark-200 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-orange to-primary-skyblue rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-gray-400">VideoStream Pro</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                Welcome, <span className="text-primary-orange font-semibold">Admin</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Admin Navigation Tabs */}
        <div className="flex space-x-1 bg-dark-200 rounded-lg p-1 mb-8">
          <button
            onClick={() => {
              setActiveTab('videos');
              router.push('/admin/dashboard');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              currentTab === 'videos'
                ? 'bg-primary-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Videos
          </button>
          <button
            onClick={() => {
              setActiveTab('local-videos');
              router.push('/admin/local-videos');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              currentTab === 'local-videos'
                ? 'bg-primary-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-4 h-4 inline mr-2" />
            Local Files
          </button>
          <button
            onClick={() => {
              setActiveTab('ads');
              router.push('/admin/ads');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              currentTab === 'ads'
                ? 'bg-primary-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Ads
          </button>
          <button
            onClick={() => {
              setActiveTab('stats');
              router.push('/admin/stats');
            }}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              currentTab === 'stats'
                ? 'bg-primary-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
        </div>

        {/* Admin Content */}
        <div className="bg-dark-200 rounded-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
