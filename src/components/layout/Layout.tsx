import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  QrCodeIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-deep-purple/95 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Link
              to="/"
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive('/') ? 'text-menu-active' : 'text-gray-400 hover:text-menu-hover'
              }`}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link
              to="/menu"
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive('/menu') ? 'text-menu-active' : 'text-gray-400 hover:text-menu-hover'
              }`}
            >
              <QrCodeIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </Link>

            <Link
              to="/orders"
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive('/orders') ? 'text-menu-active' : 'text-gray-400 hover:text-menu-hover'
              }`}
            >
              <ClipboardDocumentListIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Orders</span>
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive('/profile') ? 'text-menu-active' : 'text-gray-400 hover:text-menu-hover'
              }`}
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
