// Database types and interfaces
export interface Video {
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
  externalUrl?: string; // Optional external URL for videos that can't be embedded
}

export interface AdsterraAd {
  id: string;
  type: 'banner' | 'native' | 'smart_direct_link';
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  clickCount: number;
  createdAt: Date;
}

export interface DownloadStep {
  stepNumber: number;
  ads: AdsterraAd[];
  requiredTime: number; // seconds
  completed: boolean;
}

export interface UserSession {
  id: string;
  videoId?: string;
  downloadSteps?: DownloadStep[];
  adViewTimes: { [adId: string]: number };
  tokens: { [key: string]: { value: string; expires: Date } };
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
}
