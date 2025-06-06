import type { Member, MemberProps } from '../../types/member';
import { baseApi } from './baseApi';

export const memberApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMembers: build.query<{
            data: Member[];
            pagination: {
                totalMembers: number;
                totalPages: number;
                currentPage: number;
                pageSize: number;
            }
        }, {
            page?: number;
            limit?: number;
            familyBranch?: string;
        }>({
            query: ({ page = 1, limit = 10, familyBranch }) => {
                let url = `/member?page=${page}&limit=${limit}`;
                if (familyBranch) {
                    url += `&familyBranch=${familyBranch}`;
                }
                return {
                    url,
                    method: 'GET',
                    credentials: 'include'
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Members' as const, id: _id })),
                        { type: 'Members' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Members' as const, id: 'LIST' }],
        }),

        getMember: build.query<Member, string>({
            query: (id) => ({
                url: `/member/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Members' as const, id }],
        }),

        createMember: build.mutation<Member, {formData: FormData}>({
            query: (formData) => {
                console.log(formData);
                
                return {
                    url: '/member',
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                };
            },
            invalidatesTags: [{ type: 'Members' as const, id: 'LIST' }],
        }),

        updateMember: build.mutation<Member, { id: string, data: FormData }>({
            query: ({ id, data }) => {
                console.log(data);

                return {
                    url: `/member/${id}`,
                    method: 'PATCH',
                    body: data,
                    credentials: 'include'
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Members' as const, id },
                { type: 'Members' as const, id: 'LIST' },
            ],
        }),

        deleteMember: build.mutation<{
            success: boolean;
            message: string;
            data: null
        }, string>({
            query: (id) => ({
                url: `/member/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Members' as const, id },
                { type: 'Members' as const, id: 'LIST' },
            ],
        }),

        getMembersByBranchAndRelationship: build.query<MemberProps[], { familyBranch: string; relationship: string}>({
            query: ({ familyBranch, relationship }) => {
                const params = new URLSearchParams();
                params.append('familyBranch', familyBranch);
                params.append('relationship', relationship);

                return {
                    url: `member/by-branch-relationship?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include'
                };
            },
            transformResponse: (response: { data: MemberProps[] }) => response.data,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Members' as const, _id }))]
                    : [{ type: 'Members' as const, id: 'LIST' }],
        }),
    }),
});

export const {
    useGetMembersQuery,
    useGetMemberQuery,
    useCreateMemberMutation,
    useUpdateMemberMutation,
    useDeleteMemberMutation,
    useGetMembersByBranchAndRelationshipQuery,
} = memberApi;