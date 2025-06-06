import { useState } from 'react';
import { useGetAlbumsQuery, useCreateAlbumMutation, useDeleteAlbumMutation, useUpdateAlbumMutation } from '../store/api/albumApi';
import type { Album, CreateAlbumDTO } from '../types/album';

export const useAlbums = () => {
  const [page, setPage] = useState(1);
  const limit = 8;
  
  const { data, isLoading } = useGetAlbumsQuery({ page, limit });
  const [createAlbumMutation] = useCreateAlbumMutation();
  const [deleteAlbumMutation] = useDeleteAlbumMutation();
  const [updateAlbumMutation] = useUpdateAlbumMutation();

  const createAlbum = async (albumData: CreateAlbumDTO) => {
    await createAlbumMutation(albumData).unwrap();
  };

  const deleteAlbum = async (id: string) => {
    await deleteAlbumMutation(id).unwrap();
  };

  const updateAlbum = async (id: string, updates: Pick<Album, 'name' | 'description'>) => {
    await updateAlbumMutation({ id, updates }).unwrap();
  };

  return {
    albums: data?.data || [],
    pagination: data?.pagination || {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: limit
    },
    isLoading,
    createAlbum,
    deleteAlbum,
    updateAlbum,
    setPage
  };
};