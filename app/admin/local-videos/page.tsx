'use client';

import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import LocalVideoManager from '@/components/admin/LocalVideoManager';

export default function AdminLocalVideos() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <LocalVideoManager />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
