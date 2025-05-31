import type { IUpdateUserDTO, Pagination, User } from '../../types/user';
import { baseApi } from './baseApi';


export const memberApi = baseApi.injectEndpoints({
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

        createUser: build.mutation<IUpdateUserDTO, FormData>({
            query: (formData) => ({
                url: 'auth/register',
                method: 'POST',
                body: formData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }],
        }),

        createMember: build.mutation<IUpdateUserDTO, FormData>({
            query: (formData) => ({
                url: 'user',
                method: 'POST',
                body: formData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }],
        }),

        updateUser: build.mutation<User, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/user/${id}`,
                method: 'PATCH',
                body: formData,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users' as const, id },
                { type: 'Users' as const, id: 'LIST' },
            ],
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
            id: string;
            entity: string;
            action: string;
            value: boolean
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
    useCreateMemberMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdatePermissionsMutation,
} = memberApi;