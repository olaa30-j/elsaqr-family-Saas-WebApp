import type { User } from '../../types/user';
import { baseApi } from './baseApi';

export const roleApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        updateRolesWithPermissions: build.mutation<User, {
            id: string;
            entity: string;
            action: string;
            value: boolean;
        }>({
            query: ({ id, ...permissionData }) => ({
                url: `/user/${id}/permissions`,
                method: 'PATCH',
                body: permissionData,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users' as const, id },
            ],
        }),

        // إضافة دور للمستخدم
        addUserRole: build.mutation<User, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/user/${id}/roles`,
                method: 'POST',
                body: { role },
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users' as const, id },
            ],
        }),

        // إزالة دور من المستخدم
        removeUserRole: build.mutation<User, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/user/${id}/roles`,
                method: 'DELETE',
                body: { role },
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users' as const, id },
            ],
        }),

        getAllRoles: build.query<any, void>({
            query: () => ({
                url: '/user/roles',
                method: 'GET',
                credentials: 'include'
            }),
        }),
    }),
});

export const {
    useUpdateRolesWithPermissionsMutation,
    useAddUserRoleMutation,
    useRemoveUserRoleMutation,
    useGetAllRolesQuery,
} = roleApi;