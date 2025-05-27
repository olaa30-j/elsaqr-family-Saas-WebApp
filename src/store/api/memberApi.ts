import type { CreateMemberDto, Pagination, User } from '../../types/user';
import { baseApi } from './baseApi';


export const memberApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMembers: build.query<{ data: User[]; pagination: Pagination }, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/user?page=${page}&limit=${limit}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Members' as const, id: _id })),
                        { type: 'Members' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Members' as const, id: 'LIST' }],
        }),
        getMember: build.query<User, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Members' as const, id }],
        }),

        createMember: build.mutation<User, FormData>({
            query: (formData) => ({
                url: 'auth/register',
                method: 'POST',
                body: formData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Members' as const, id: 'LIST' }],
        }),

        updateMember: build.mutation<User, { _id: string } & Partial<CreateMemberDto> & { imageFile?: File }>({
            query: ({ _id, imageFile, ...body }) => {
                const formData = new FormData();
                for (const [key, value] of Object.entries(body)) {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                }
                if (imageFile) {
                    formData.append('image', imageFile);
                }
                return {
                    url: `/user/${_id}`,
                    method: 'PUT',
                    body: formData,
                    credentials: 'include'
                };
            },
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Members' as const, _id },
                { type: 'Members' as const, _id: 'LIST' },
            ],
        }),

        deleteMember: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Members' as const, id },
                { type: 'Members' as const, id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetMembersQuery,
    useGetMemberQuery,
    useCreateMemberMutation,
    useUpdateMemberMutation,
    useDeleteMemberMutation,
} = memberApi;
