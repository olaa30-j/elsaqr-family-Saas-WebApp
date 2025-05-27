import React from "react";
import type { TabBarProps } from "../../types/home";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from "../../store/store";
import { isActive } from "../../App";
import { toast } from "react-toastify";

const TabBar: React.FC<TabBarProps> = ({ setShowMoreOptions }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  let homeButton = isAuthenticated ? '/dashboard' : '/'
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (!isAuthenticated && path !== '/') {
      toast.warn("يرجى تسجيل الدخول")
      navigate('/login', { state: { from: path } });
      return;
    }
    navigate(path);
  };

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 right-0 left-0 bg-white dark:bg-slate-900 shadow-lg z-50 border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => handleNavigation(homeButton)}
          className={`nav-item flex flex-col items-center justify-center text-xs font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              aria-hidden="true"
              className={`h-5 w-5 ${isActive(homeButton) ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
              viewBox="0 0 576 512"
            >
              <path
                fill="currentColor"
                d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              />
            </svg>
          </div>
          <span className="mt-1">الرئيسية</span>
        </button>

        {/* Family Tree */}
        <button
          onClick={() => handleNavigation('/profile')}
          className={`nav-item flex flex-col items-center justify-center text-xs font-medium transition-colors ${isActive('/family-tree') ? 'text-primary' : 'text-color-2 hover:text-foreground'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              aria-hidden="true"
              className={`h-5 w-5 ${isActive('/family-tree') ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
              viewBox="0 0 640 512"
            >
              <path
                fill="currentColor"
                d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
              />
            </svg>
          </div>
          <span className="mt-1">العائلة</span>
        </button>

        {/* Announcements */}
        <button
          onClick={() => handleNavigation('/announcements')}
          className={`nav-item flex flex-col items-center justify-center text-xs font-medium transition-colors ${isActive('/announcements') ? 'text-primary' : 'text-color-2 hover:text-foreground'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              aria-hidden="true"
              className={`h-5 w-5 ${isActive('/announcements') ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
              />
            </svg>
          </div>
          <span className="mt-1">الإعلانات</span>
        </button>

        {/* Events */}
        <button
          onClick={() => handleNavigation('/events')}
          className={`nav-item flex flex-col items-center justify-center text-xs font-medium transition-colors ${isActive('/events') ? 'text-primary' : 'text-color-2 hover:text-foreground'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              aria-hidden="true"
              className={`h-5 w-5 ${isActive('/events') ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48H0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"
              />
            </svg>
          </div>
          <span className="mt-1">الأحداث</span>
        </button>

        {/* More */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login');
              return;
            }
            setShowMoreOptions();
          }}
          className={`nav-item flex flex-col items-center justify-center text-xs font-medium transition-colors ${location.pathname.startsWith('/more') ? 'text-primary' : 'text-color-2 hover:text-foreground'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <svg
              aria-hidden="true"
              className={`h-5 w-5 ${location.pathname.startsWith('/more') ? 'text-primary' : 'text-color-2/60 hover:text-primary'}`}
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
              />
            </svg>
          </div>
          <span className="mt-1">المزيد</span>
        </button>
      </div>
    </nav>
  );
};

export default TabBar;