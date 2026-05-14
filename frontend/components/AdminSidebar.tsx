'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminLayout } from '@/context/AdminLayoutContext';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  href: string;
  active: boolean;
}

interface SidebarProps {
  activeMenu: 'dashboard' | 'products' | 'orders' | 'users' | 'settings';
}

export function AdminSidebar({ activeMenu }: SidebarProps) {
  const router = useRouter();
  const { sidebarOpen } = useAdminLayout();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/admin/login');
  };

  const menuItems: MenuItem[] = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin', active: activeMenu === 'dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products', active: activeMenu === 'products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', active: activeMenu === 'orders' },
    // { icon: Users, label: 'Users', href: '/admin/users', active: activeMenu === 'users' },
    // { icon: Settings, label: 'Settings', href: '/admin/settings', active: activeMenu === 'settings' },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } h-screen bg-white text-gray-900 transition-all duration-300 flex flex-col border-r border-gray-200`}
    >
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <BarChart3 size={24} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-bold text-lg text-gray-900">Admin</span>}
        </Link>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4 space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} />
          {sidebarOpen && <span className="text-sm">Settings</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
