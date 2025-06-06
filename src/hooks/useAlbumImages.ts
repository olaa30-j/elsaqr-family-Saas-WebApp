import { useState } from 'react';
import { 
  useGetAlbumQuery,
  useAddImageToAlbumMutation,
  useRemoveImageFromAlbumMutation 
} from '../store/api/albumApi';
import type { Album } from '../types/album';

export const useAlbumImages = (albumId: string) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const { 
    data: album, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetAlbumQuery(albumId);
  
  const [addImageToAlbum] = useAddImageToAlbumMutation();
  const [removeImageFromAlbum] = useRemoveImageFromAlbumMutation();

  const uploadImage = async (file: File, description?: string): Promise<Album> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await addImageToAlbum({ 
        albumId, 
        file, 
        description 
      }).unwrap();
      
      await refetch();
      
      return result;
    } catch (error:any) {
      throw new Error(`فشل رفع الصورة: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (albumId:string, imageId: string): Promise<void> => {
    try {
      await removeImageFromAlbum({ albumId, imageId }).unwrap();
      await refetch();
    } catch (error:any) {
      throw new Error(`فشل حذف الصورة: ${error.message}`);
    }
  };

  return {
    album,
    isLoading: isLoading || isFetching,
    isUploading,
    uploadProgress,
    uploadImage,
    deleteImage,
    refetch
  };
};