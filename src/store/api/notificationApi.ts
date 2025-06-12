import type { Pagination } from '../../types/user';
import type { INotification } from '../../types/notifications';
import { baseApi } from './baseApi';

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<{ data: INotification[]; pagination: Pagination }, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/notification?page=${page}&limit=${limit}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Notifications' as const, id: _id })),
                        { type: 'Notifications' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Notifications' as const, id: 'LIST' }],
        }),

        getUnreadCount: build.query<{ count: number }, void>({
            query: () => ({
                url: '/notification/unread-count',
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: ['Notifications']
        }),

        markAsRead: build.mutation<INotification, string>({
            query: (id) => ({
                url: `/notification/${id}/read`,
                method: 'PATCH',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Notifications' as const, id },
                { type: 'Notifications' as const, id: 'LIST' },
            ],
        }),

        markAllAsRead: build.mutation<void, void>({
            query: () => ({
                url: '/notification/read-all',
                method: 'PATCH',
                credentials: 'include'
            }),
            invalidatesTags: ['Notifications']
        }),

        deleteNotification: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/notification/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Notifications' as const, id },
                { type: 'Notifications' as const, id: 'LIST' },
            ],
        }),

        createNotification: build.mutation<INotification, {
            recipientId: string;
            message: string;
            action: string;
            entity: { type: string; id: string };
            metadata?: { deepLink?: string; priority?: string };
        }>({
            query: (notificationData) => ({
                url: '/notification',
                method: 'POST',
                body: notificationData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Notifications' as const, id: 'LIST' }],
        }),

        updateShowByEntityType: build.mutation<{
            message: string;
            data: {
                entityType: string;
                show: boolean;
                matchedCount: number;
                modifiedCount: number;
            };
        }, { show: boolean; entityType: string }>({
            query: ({ show, entityType }) => ({
                url: '/notification/show-by-entity',
                method: 'PATCH',
                body: { show, entityType },
                credentials: 'include'
            }),
            invalidatesTags: ['Notifications']
        }),

        getShowStatusByEntityType: build.query<{
            data: {
                entityType: string;
                show: boolean;
                success: boolean;
                consistent: boolean;
            }
        }, string>({
            query: (entityType) => ({
                url: `/notification/${entityType}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, entityType) => [
                { type: 'Notifications' as const, id: `ENTITY_TYPE_${entityType}` }
            ],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useCreateNotificationMutation,
    useUpdateShowByEntityTypeMutation,
    useGetShowStatusByEntityTypeQuery,
} = notificationApi;