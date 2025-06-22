import { useState, useEffect } from 'react';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation
} from '../../store/api/notificationApi';
import { Link } from 'react-router-dom';

const DropdownNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoMarkAsRead, setAutoMarkAsRead] = useState<any | null>(null);

  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery({
    page: 1,
    limit: 20
  }, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const { data: unreadCountData, refetch: refetchUnreadCount } = useGetUnreadCountQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  
  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.data.count || 0;

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      if (autoMarkAsRead) {
        clearTimeout(autoMarkAsRead);
      }

      const timer = setTimeout(() => {
        handleMarkAllAsRead();
      }, 5000);

      setAutoMarkAsRead(timer);

      return () => {
        if (autoMarkAsRead) {
          clearTimeout(autoMarkAsRead);
        }
      };
    }
  }, [isOpen, unreadCount]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetchNotifications();
      refetchUnreadCount();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      refetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-200 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${unreadCount > 0 ? 'text-primary animate-bell' : 'text-gray-600'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
          {unreadCount > 0 && (
            <circle
              cx="18"
              cy="6"
              r="3"
              fill="#EF4444"
              className="animate-pulse"
            />
          )}
        </svg>

        {unreadCount > 0 && (
          <span className="absolute left-4 top-10 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -left-12 md:left-0 top-16 w-80 bg-white rounded-md shadow-lg overflow-hidden z-[1000]  min-h-[40vh] max-h-[70vh]">
          <div className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="px-4 py-4 flex justify-between items-center border-b bg-gray-100">
              <h3 className="font-semibold text-primary">الإشعارات</h3>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-800 hover:text-primary/90"
              >
                قراءة الكل
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-center text-gray-500">
                  لا توجد إشعارات جديدة
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <div className="flex items-start">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary/50"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t text-center">
              <Link
                to={`/profile?tab=activities`}
                className="text-sm font-medium text-primary hover:text-primary/90"
                onClick={() => setIsOpen(false)}
              >
                عرض جميع الإشعارات
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DropdownNotification;