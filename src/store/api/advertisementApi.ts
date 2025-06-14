import type { IAdvertisement, IAdvertisementForm, Pagination } from '../../types/advertisement';
import { baseApi } from './baseApi';

export const advertisementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdvertisements: build.query<{ data: IAdvertisement[]; pagination: Pagination }, {
      page?: number;
      limit?: number;
    }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/advertisement`,
        method: 'GET',
        params: {
          page,
          limit,
        },
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
      title: string;
      type: string;
      content: string;
      image?: File | null;
      status:string;
    }>({
      query: (adData) => {
        const formData = new FormData();
        formData.append('title', adData.title);
        formData.append('type', adData.type);
        formData.append('content', adData.content);
        formData.append('status', adData.status);
        if (adData.image) {
          formData.append('image', adData.image);
        }

        return {
          url: '/advertisement',
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Content-Type': undefined,
          },
        };
      },
      invalidatesTags: [{ type: 'Advertisements' as const, id: 'LIST' }],
    }),

    // Update advertisement
    updateAdvertisement: build.mutation<IAdvertisement, {
      id: string;
      updates: Partial<IAdvertisementForm> & { image?: File | null }
    }>({
      query: ({ id, updates }) => {
        const formData = new FormData();

        if (updates.title) formData.append('title', updates.title);
        if (updates.type) formData.append('type', updates.type);
        if (updates.content) formData.append('content', updates.content);
        if (updates.status) formData.append('status', updates.status);
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