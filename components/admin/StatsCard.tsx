'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-dark-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-semibold">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`text-${color} bg-${color} bg-opacity-20 p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
