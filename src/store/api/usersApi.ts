import type { Pagination, User } from '../../types/user';
import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<{ data: User[]; pagination: Pagination }, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/user?page=${page}&limit=${limit}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
                        { type: 'Users' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Users' as const, id: 'LIST' }],
        }),

        getUser: build.query<User, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Users' as const, id }],
        }),

        createUser: build.mutation<User, { data: any }>({
            query: (data) => {
                return {
                    url: '/user',
                    method: 'POST',
                    body: data.data,
                    credentials: 'include'
                }
            },
            invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }],
        }),

        updateUser: build.mutation<User, { id: string; data: any }>({
            query: ({ id, data }) => {
                return {
                    url: `/user/${id}`,
                    method: 'PATCH',
                    body: data,
                    credentials: 'include'
                };
            },
            invalidatesTags: (_result, _error, { id }) => {
                return [
                    { type: 'Users' as const, id },
                    { type: 'Users' as const, id: 'LIST' },
                ];
            },
        }),

        deleteUser: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Users' as const, id },
                { type: 'Users' as const, id: 'LIST' },
            ],
        }),

        updatePermissions: build.mutation<User, {
            id?: string;
            entity: string;
            action: string;
            value: boolean;
        }>({
            query: ({ id, ...body }) => ({
                url: `/user/${id}/permissions`,
                method: 'PATCH',
                body,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users' as const, id },
                { type: 'Users' as const, id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdatePermissionsMutation,
} = userApi;