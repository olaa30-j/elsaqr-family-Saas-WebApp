import { useParams } from 'react-router-dom';
import { Trash2, Image as ImageIcon, Upload as UploadIcon } from 'lucide-react';
import { AlbumView } from '../../components/dashboard/free/album/AlbumView';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useAlbumImages } from '../../hooks/useAlbumImages';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import type { Album } from '../../types/album';

const AlbumDetailPage = () => {
  const { id } = useParams();
  const {
    album,
    isLoading,
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress
  } = useAlbumImages(id!);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [albumData, setAlbumData] = useState<Album | undefined>(album);
  const [selectedImage, setSelectedImage] = useState<{ id: string, url: string } | null>(null);

  useEffect(() => {
    if (album && album.data) {
      setAlbumData(album.data);
    }
  }, [album]);

  const handleUpload = async (file: File) => {
    try {
      await uploadImage(file);
      toast.success('تم رفع الصورة بنجاح');
      setIsUploadModalOpen(false);
    } catch (error) {
      toast.error('فشل رفع الصورة');
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      toast.success('تم حذف الصورة بنجاح');
      setSelectedImage(null); 
    } catch (error) {
      toast.error('فشل حذف الصورة');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!albumData) return <div className="text-center py-12 text-xl">لا يوجد ألبومات</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{albumData.name}</h1>
        <div className='flex gap-4'>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            disabled={isUploading}
          >
            {isUploading ? `جاري الرفع... ${uploadProgress}%` : 'إضافة صورة جديدة'}
          </button>
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="px-4 py-2 rounded-lg border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white"
            disabled={isUploading}
          >
            إدارة البوم الصور
          </button>
        </div>
      </div>

      {/* Manage Modal */}
      {isManageModalOpen && album && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
          <AlbumView
            album={album}
            onClose={() => setIsManageModalOpen(false)}
            onImageUpload={uploadImage}
            onImageDelete={deleteImage}
          />
        </div>
      )}

      {albumData.description && (
        <p className="text-gray-600 mb-6 text-lg">{albumData.description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
        {albumData.images?.length ? (
          albumData.images.map((image: any) => (
            <div key={image._id} className="relative group">
              <img
                src={image.image}
                alt={image.description || 'صورة الألبوم'}
                className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={() => setSelectedImage({ id: image._id, url: image.image })}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image._id);
                  }}
                  className="bg-red-500 text-white p-2 rounded-full mr-2 hover:bg-red-600"
                  title="حذف الصورة"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 m-auto text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4" />
            <p className="text-xl">لا توجد صور في هذا الألبوم</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              إضافة صورة جديدة
            </button>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title="معاينة الصورة"
        >
          <div className="p-4">
            <img
              src={selectedImage.url}
              alt="معاينة الصورة"
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleDelete(selectedImage.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                حذف الصورة
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                إغلاق
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="رفع صورة جديدة"
        extraStyle='bg-primary'
      >
        <div className="p-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>جاري رفع الصورة... {uploadProgress}%</p>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <UploadIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">اضغط لاختيار صورة أو اسحبها هنا</p>
                  <p className="text-sm text-gray-500 mt-2">JPEG, PNG, GIF (الحد الأقصى 10MB)</p>
                </label>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlbumDetailPage;