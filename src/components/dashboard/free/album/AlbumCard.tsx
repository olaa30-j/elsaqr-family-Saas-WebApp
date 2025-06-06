import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Modal from '../../../ui/Modal';
import type { Album } from '../../../../types/album';

interface Image {
  _id: string;
  image: string;
  title?: string;
}


interface AlbumCardProps {
  album: Album;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Pick<Album, 'name' | 'description'>) => Promise<void> | void;
}

const albumSchema = yup.object({
  name: yup.string().required('اسم الألبوم مطلوب').min(3, 'يجب أن يكون الاسم 3 أحرف على الأقل'),
  description: yup.string().optional().max(500, 'الوصف يجب أن لا يتجاوز 500 حرف'),
});

export const AlbumCard = ({ album, onSelect, onEdit, onDelete }: AlbumCardProps) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Pick<Album, 'name' | 'description'>>({
    resolver: yupResolver(albumSchema as any),
    defaultValues: {
      name: album.name,
      description: album.description || '',
    },
  });

  const isPopulatedImage = (img: unknown): img is Image => {
    return typeof img === 'object' && img !== null && 'image' in img;
  };

  const firstImageUrl = album.images?.[0]
    ? isPopulatedImage(album.images[0])
      ? album.images[0].image
      : null
    : null;

  const handleSelectAlbum = () => {
    navigate(`/albums/${album._id}`);
    onSelect(album._id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log(album._id);
    
    try {
      onDelete(album._id);
      toast.success('تم حذف الألبوم بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الألبوم');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    reset({
      name: album.name,
      description: album.description || '',
    });
    setIsEditModalOpen(true);
  };

  const onSubmit = async (data: Pick<Album, 'name' | 'description'>) => {
    setIsSubmitting(true);
    console.log(album._id, {
        name: data.name,
        description: data.description,
      });
    
    try {
      await onEdit(album._id, {
        name: data.name,
        description: data.description,
      });
      toast.success('تم تحديث الألبوم بنجاح');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الألبوم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white overflow-hidden border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleSelectAlbum}
        aria-label={`الألبوم ${album.name}`}
      >
        <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
          {firstImageUrl ? (
            <img
              src={firstImageUrl}
              alt={album.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
              <ImageIcon size={48} strokeWidth={1} />
              <span className="mt-2 text-sm">لا توجد صور</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg text-gray-800 truncate">{album.name}</h3>
              {album.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{album.description}</p>
              )}
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={handleEditClick}
                className="text-color-2 hover:text-primary p-1 rounded-full hover:bg-blue-50 transition-colors"
                aria-label="تعديل الألبوم"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                aria-label="حذف الألبوم"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center">
              <span className="ml-1">
                {album.createdBy.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>{album.images.length} صورة</span>
              <span>•</span>
              <span>
                {new Date(album.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="حذف الألبوم"
        type='delete'
        onConfirm={handleConfirmDelete}
      >
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mt-1">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">هل أنت متأكد من حذف الألبوم "{album.name}"؟</p>
              <p className="text-sm text-gray-600 mt-1">
                سيتم حذف الألبوم بشكل دائم ولا يمكن استعادته.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل الألبوم"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="album-name" className="block text-sm font-medium text-gray-700 mb-1">
              اسم الألبوم *
            </label>
            <input
              id="album-name"
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل اسم الألبوم"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="album-description" className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              id="album-description"
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل وصف الألبوم (اختياري)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};