import type { Transaction } from '../../types/financial';
import { baseApi } from './baseApi';

export const financialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation<Transaction, FormData>({
      query: (formData) => ({
        url: '/financial/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Transaction'],
    }),
    getTransactions: builder.query({
      query: (params = {}) => ({
        url: '/financial/',
        method: 'GET',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.type && { type: params.type }),
          ...(params.category && { category: params.category }),
          ...(params.search && { search: params.search }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.sortBy && { sortBy: params.sortBy }),
          ...(params.sortOrder && { sortOrder: params.sortOrder }),
        },
      }),
      providesTags: ['Transaction'],
      transformResponse: (response: {
        success: boolean;
        data: any[];
        pagination: any;
        message: string;
      }) => ({
        transactions: response.data,
        pagination: response.pagination,
      }),
    }),

    getTransactionById: builder.query({
      query: (id) => `/financial/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),

    updateTransaction: builder.mutation<Transaction, { id: string; formData: FormData }>({
      query: ({ id, formData }) => {
        return {
          url: `/financial/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Transaction', id },
        'Transaction',
      ],
    }),

    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/financial/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),

    uploadTransactionImage: builder.mutation({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append('image', image);

        return {
          url: `/financial/${id}/image`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Transaction', id },
        'Transaction',
      ],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useUploadTransactionImageMutation,
} = financialApi;