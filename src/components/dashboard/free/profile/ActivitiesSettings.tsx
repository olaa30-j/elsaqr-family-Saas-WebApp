import { useSearchParams } from 'react-router-dom';
import {
    useGetNotificationsQuery,
    useDeleteNotificationMutation,
    useMarkAsReadMutation
} from '../../../../store/api/notificationApi';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ActivitiesSettings = () => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab');

    const { data: notifications, isLoading, isError } = useGetNotificationsQuery({
        page: 1,
        limit: 10
    });

    const [deleteNotification] = useDeleteNotificationMutation();
    const [markAsRead] = useMarkAsReadMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id).unwrap();
            toast.error("تم حذف الإشعار بنجاح")
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
    
    if (isError) return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center text-red-500">
            حدث خطأ أثناء جلب البيانات
        </div>
    );

    return (
        <div
            data-state={activeTab === "activities" ? "active" : "inactive"}
            role="tabpanel"
            aria-labelledby="activities-tab"
            id="activities-tab-content"
            tabIndex={0}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex md:flex-row flex-col-reverse justify-between md:items-center gap-4 mb-6 border-b border-gray-200 pb-3">
                    <h3 className="text-responsive-lg font-semibold">سجل النشاطات والإشعارات</h3>
                    <div className="text-sm text-muted-foreground text-end">
                        {notifications?.data.length || 0} إشعار
                    </div>
                </div>
                
                <div className="space-y-4">
                    {notifications && notifications?.data.length > 0 ? (
                        notifications.data.map((notification: any) => (
                            <div
                                key={notification._id}
                                className={`border rounded-lg p-4 transition-all duration-200 ${
                                    notification.read ? 'bg-gray-50 opacity-90' : 'bg-white border-primary/20 shadow-sm'
                                } hover:shadow-md`}
                            >
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-2 rounded-full mx-3 hidden md:block flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-primary"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{notification.message}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {notification.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 items-start">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                            >
                                                وضع مقروء
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification._id)}
                                            className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                            title="حذف الإشعار"
                                        >
                                            <Trash2 className='w-5 h-5 text-red-500' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400"
                                >
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-gray-500 mb-2">لا توجد إشعارات</h4>
                            <p className="text-sm text-muted-foreground text-center max-w-md">
                                عندما تتلقى إشعارات جديدة، ستظهر هنا
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivitiesSettings;