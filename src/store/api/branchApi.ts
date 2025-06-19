import { baseApi } from './baseApi';
import type {
    Branch,
    CreateBranchRequest,
    UpdateBranchRequest,
    ToggleVisibilityRequest,
} from '../../types/branch';

interface PaginatedBranchesResponse {
    data: Branch[];
    pagination: {
        totalBranches: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

export const branchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBranch: builder.mutation<Branch, { branchData: CreateBranchRequest }>({
            query: ({ branchData }) => {
                if (!branchData.name) {
                    throw new Error('Branch name is required');
                }

                return {
                    url: '/branch',
                    method: 'POST',
                    body: branchData,
                    credentials: 'include'
                };
            },
            invalidatesTags: ['Branches'],  
            transformErrorResponse: (response: any) => {
                return {
                    success: false,
                    message: response.data?.message || 'Failed to create branch'
                };
            },
        }),

        getAllBranches: builder.query<PaginatedBranchesResponse, { page?: number, limit?: number }>({
            query: ({ page = 1, limit = 15 }) => ({
                url: '/branch',
                params: { page, limit } 
            }),
            providesTags: ['Branches'],
            transformResponse: (response: any) => ({
                data: response.data,
                pagination: response.pagination
            }),
        }),

        getBranchById: builder.query<Branch, string>({
            query: (id) => `/branch/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Branches', id }],  
            transformErrorResponse: (response: any) => {
                return {
                    success: false,
                    message: response.data?.message || 'Branch not found'
                };
            },
        }),

        updateBranch: builder.mutation<Branch, { _id: string; updateData: UpdateBranchRequest }>({
            query: ({ _id, updateData }) => ({  
                url: `/branch/${_id}`,
                method: 'PATCH',
                body: updateData,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                'Branches',
                { type: 'Branches', id: _id }
            ],  
            transformErrorResponse: (response: any) => {
                return {
                    success: false,
                    message: response.data?.message || 'Failed to update branch'
                };
            },
        }),

        toggleBranchVisibility: builder.mutation<Branch, ToggleVisibilityRequest>({
            query: ({ _id }) => ({
                url: `/branch/${_id}/toggle-visibility`,
                method: 'PATCH',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                'Branches',
                { type: 'Branches', id: _id }
            ],
            transformResponse: (response: any) => response.data,  
        }),

        deleteBranch: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/branch/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ['Branches'],
            transformErrorResponse: (response: any) => {
                return {
                    success: false,
                    message: response.data?.message || 'Failed to delete branch'
                };
            },
        }),
    }),
});

export const {
    useCreateBranchMutation,
    useGetAllBranchesQuery,
    useGetBranchByIdQuery,
    useUpdateBranchMutation,
    useToggleBranchVisibilityMutation,
    useDeleteBranchMutation
} = branchApi;