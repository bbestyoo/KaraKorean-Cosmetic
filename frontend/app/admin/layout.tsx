'use client';

import { AdminLayoutProvider } from '@/context/AdminLayoutContext';
import { AdminSidebar } from '@/components/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Determine active menu based on current path
  const getActiveMenu = (): 'dashboard' | 'products' | 'orders' | 'users' | 'settings' => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/orders')) return 'orders';
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <AdminLayoutProvider>
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
        <AdminSidebar activeMenu={getActiveMenu()} />
        <div className="flex-1 flex flex-col h-screen w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </AdminLayoutProvider>
  );
}
