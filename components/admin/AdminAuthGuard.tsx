'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
      setIsAuthenticated(isAuth);
      
      if (!isAuth) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-orange animate-spin mx-auto mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
