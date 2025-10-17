'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin login
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
        <p className="text-white">Redirecting to admin login...</p>
      </div>
    </div>
  );
}