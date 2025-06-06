import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { Album } from '../../../../types/album';

interface AlbumViewProps {
  album: Album;
  onClose: () => void;
  onImageUpload: (file: File, description?: string) => Promise<Album>;
  onImageDelete: (album:string,imageId: string) => void;
}

export const AlbumView = ({ album, onClose, onImageUpload, onImageDelete }: AlbumViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-8 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-4xl min-h-[90vh] flex flex-col overflow-y-auto mt-10"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{album.data && album.data.name}</h2>
          <button onClick={() => onClose()} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {album.data && album.data.description && (
            <p className="text-gray-600 mb-4">{album.data && album.data.description}</p>
          )}

          <ImageUploader onUpload={onImageUpload} />

          <div className="mt-6">
            <h3 className="font-medium mb-3">الصور ({album.data && album.data.images?.length || 0})</h3>

            {album.data && album.data.images?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {album.data && album.data.images.map((image: any) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={image.image}
                      alt=""
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => onImageDelete(album.data._id,image._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-8 px-4 text-center"
                >
                  <div className="mb-6 p-4 bg-primary/10 rounded-full">
                    <svg
                      className="w-12 h-12 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    لا يوجد صور في هذا الألبوم
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    قم بإضافة أول صورة لبدء هذا الألبوم وجعله أكثر حيوية
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>

  )
};