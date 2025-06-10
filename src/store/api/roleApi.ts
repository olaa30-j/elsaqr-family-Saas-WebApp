import type { User } from '../../types/user';
import { baseApi } from './baseApi';

type RoleResponse = {
    data: any;
    roles: string[];
};

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
                { type: 'Roles', id },
            ],
        }),

        addUserRole: build.mutation<RoleResponse, { role: string }>({
            query: ({ role }) => ({
                url: `/permission`,
                method: 'POST',
                body: { role },
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error) => [
                { type: 'Roles' },
                { type: 'Users' }
            ],
        }),

        removeRoleFromAllUsers: build.mutation<{
            success: boolean;
            message: string;
            data?: {
                deletedRole: string;
                affectedUsers: number;
            };
        }, { role: string }>({
            query: ({ role }) => ({
                url: `/permission/${role}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: () => [
                { type: 'Roles', id: 'LIST' },
                { type: 'Users' }
            ],
        }),

        getAllRoles: build.query<RoleResponse, void>({
            query: () => ({
                url: '/permission/roles',
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result?.roles
                    ? [
                        ...result.roles.map((role) => ({ type: 'Roles' as const, id: role })),
                        { type: 'Roles', id: 'LIST' },
                    ]
                    : [{ type: 'Roles', id: 'LIST' }],
        }),
    }),
});

export const {
    useUpdateRolesWithPermissionsMutation,
    useAddUserRoleMutation,
    useRemoveRoleFromAllUsersMutation,
    useGetAllRolesQuery,
} = roleApi;