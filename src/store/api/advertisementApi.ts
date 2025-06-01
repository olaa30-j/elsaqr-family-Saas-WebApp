import type { IAdvertisement } from '../../types/advertisement';
import type { Pagination } from '../../types/album';
import { baseApi } from './baseApi';

export const advertisementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all advertisements with pagination
    getAdvertisements: build.query<{ data: IAdvertisement[]; pagination: Pagination }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/advertisement?page=${page}&limit=${limit}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Advertisements' as const, id: _id })),
              { type: 'Advertisements' as const, id: 'LIST' },
            ]
          : [{ type: 'Advertisements' as const, id: 'LIST' }],
    }),

    // Get single advertisement by ID
    getAdvertisement: build.query<IAdvertisement, string>({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (_result, _error, id) => [{ type: 'Advertisements' as const, id }],
    }),

    // Create new advertisement
    createAdvertisement: build.mutation<IAdvertisement, {
      address: string;
      type: string;
      content: string;
      image?: File;
    }>({
      query: (adData) => {
        const formData = new FormData();
        formData.append('address', adData.address);
        formData.append('type', adData.type);
        formData.append('content', adData.content);
        if (adData.image) {
          formData.append('image', adData.image);
        }

        return {
          url: '/advertisement',
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            // Let the browser set Content-Type with boundary
            'Content-Type': undefined,
          },
        };
      },
      invalidatesTags: [{ type: 'Advertisements' as const, id: 'LIST' }],
    }),

    // Update advertisement
    updateAdvertisement: build.mutation<IAdvertisement, { id: string; updates: Partial<IAdvertisement> & { image?: File } }>({
      query: ({ id, updates }) => {
        const formData = new FormData();
        if (updates.address) formData.append('address', updates.address);
        if (updates.type) formData.append('type', updates.type);
        if (updates.content) formData.append('content', updates.content);
        if (updates.image) formData.append('image', updates.image);

        return {
          url: `/advertisement/${id}`,
          method: 'PATCH',
          body: formData,
          credentials: 'include',
          headers: {
            'Content-Type': undefined,
          },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Advertisements' as const, id },
        { type: 'Advertisements' as const, id: 'LIST' },
      ],
    }),

    // Delete advertisement
    deleteAdvertisement: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Advertisements' as const, id },
        { type: 'Advertisements' as const, id: 'LIST' },
      ],
    }),

    // Delete all advertisements (admin only)
    deleteAllAdvertisements: build.mutation<{ deletedCount: number }, void>({
      query: () => ({
        url: '/advertisement',
        method: 'DELETE',
        body: { confirm: true },
        credentials: 'include'
      }),
      invalidatesTags: [{ type: 'Advertisements' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAdvertisementsQuery,
  useGetAdvertisementQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useDeleteAllAdvertisementsMutation,
} = advertisementApi;