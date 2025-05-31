import { useState } from 'react';
import { useGetAlbumsQuery, useCreateAlbumMutation, useDeleteAlbumMutation } from '../store/api/albumApi';
import type { CreateAlbumDTO } from '../types/album';

export const useAlbums = () => {
  const [page, setPage] = useState(1);
  const limit = 8;
  
  const { data, isLoading } = useGetAlbumsQuery({ page, limit });
  const [createAlbumMutation] = useCreateAlbumMutation();
  const [deleteAlbumMutation] = useDeleteAlbumMutation();

  const createAlbum = async (albumData: CreateAlbumDTO) => {
    await createAlbumMutation(albumData).unwrap();
  };

  const deleteAlbum = async (id: string) => {
    await deleteAlbumMutation(id).unwrap();
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
    setPage
  };
};