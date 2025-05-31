import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { Album } from '../../../../types/album';

interface AlbumViewProps {
  album: Album;
  onClose: () => void;
  onImageUpload: (file: File, description?: string) => Promise<Album>;
  onImageDelete: (imageId: string) => void;
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
          <h2 className="text-xl font-bold">{ album.data && album.data.name}</h2>
          <button onClick={()=>onClose()} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          { album.data && album.data.description && (
            <p className="text-gray-600 mb-4">{ album.data && album.data.description}</p>
          )}

          <ImageUploader onUpload={onImageUpload} />

          <div className="mt-6">
            <h3 className="font-medium mb-3">Images ({ album.data && album.data.images?.length || 0})</h3>

            { album.data && album.data.images?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                { album.data && album.data.images.map((image: any) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={image.image}
                      alt=""
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => onImageDelete(image._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-2" />
                <p>No images in this album yet</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>

  )
};