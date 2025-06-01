import type { Album, Pagination } from "../../types/album";
import { baseApi } from './baseApi';

export const albumApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Get all albums with pagination
        getAlbums: build.query<{ data: Album[]; pagination: Pagination }, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/album?page=${page}&limit=${limit}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Albums' as const, id: _id })),
                        { type: 'Albums' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Albums' as const, id: 'LIST' }],
        }),

        // Get single album by ID
        getAlbum: build.query<Album, string>({
            query: (id) => ({
                url: `/album/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: (_result, _error, id) => [{ type: 'Albums' as const, id }],
        }),

        // Create new album
        createAlbum: build.mutation<Album, { name: string; description?: string }>({
            query: (albumData) => ({
                url: '/album',
                method: 'POST',
                body: albumData,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'Albums' as const, id: 'LIST' }],
        }),

        // Update album
        updateAlbum: build.mutation<Album, { id: string; updates: Partial<Album> }>({
            query: ({ id, updates }) => ({
                url: `/album/${id}`,
                method: 'PATCH',
                body: updates,
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Albums' as const, id },
                { type: 'Albums' as const, id: 'LIST' },
            ],
        }),

        // Delete album
        deleteAlbum: build.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/album/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Albums' as const, id },
                { type: 'Albums' as const, id: 'LIST' },
            ],
        }),

        // Add image to album
        addImageToAlbum: build.mutation<Album, { albumId: string; file: File; description?: string }>({
            query: ({ albumId, file, description }) => {
                const formData = new FormData();
                formData.append('image', file);
                if (description) formData.append('description', description);

                return {
                    url: `/album/${albumId}`,
                    method: 'PUT',
                    body: formData,
                    credentials: 'include'
                };
            },
            invalidatesTags: (_result, _error, { albumId }) => [
                { type: 'Albums' as const, id: albumId },
            ],
        }),

        // Remove image from album
        removeImageFromAlbum: build.mutation<Album, { albumId: string; imageId: string }>({
            query: ({ albumId, imageId }) => ({
                url: `/album/${albumId}/images/${imageId}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: (_result, _error, { albumId }) => [
                { type: 'Albums' as const, id: albumId },
            ],
        }),
    }),
});

export const {
    useGetAlbumsQuery,
    useGetAlbumQuery,
    useCreateAlbumMutation,
    useUpdateAlbumMutation,
    useDeleteAlbumMutation,
    useAddImageToAlbumMutation,
    useRemoveImageFromAlbumMutation,
} = albumApi;