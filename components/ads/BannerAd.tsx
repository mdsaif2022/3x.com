'use client';

import { AdsterraAd } from '@/types/database';

interface BannerAdProps {
  ad: AdsterraAd;
}

export default function BannerAd({ ad }: BannerAdProps) {
  const handleAdClick = () => {
    // Track ad click
    window.open(ad.url, '_blank');
  };

  return (
    <div className="ad-banner cursor-pointer" onClick={handleAdClick}>
      <div className="flex items-center justify-center space-x-4">
        <div className="text-center">
          <h3 className="text-lg font-bold">{ad.title}</h3>
          {ad.description && (
            <p className="text-sm opacity-90">{ad.description}</p>
          )}
        </div>
        <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
          AD
        </div>
      </div>
    </div>
  );
}
