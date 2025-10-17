'use client';

import { AdsterraAd } from '@/types/database';

interface NativeAdProps {
  ad: AdsterraAd;
}

export default function NativeAd({ ad }: NativeAdProps) {
  const handleAdClick = () => {
    // Track ad click
    window.open(ad.url, '_blank');
  };

  return (
    <div 
      className="bg-dark-200 rounded-lg p-4 border border-gray-600 hover:border-primary-orange transition-colors cursor-pointer"
      onClick={handleAdClick}
    >
      <div className="flex items-center space-x-4">
        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h4 className="text-white font-semibold">{ad.title}</h4>
          {ad.description && (
            <p className="text-gray-400 text-sm mt-1">{ad.description}</p>
          )}
        </div>
        <div className="text-xs bg-primary-skyblue text-white px-2 py-1 rounded">
          AD
        </div>
      </div>
    </div>
  );
}
