import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import type { CreateAlbumDTO } from '../../../../types/album';
import { useState } from 'react';

interface AlbumFormModalProps {
  onSubmit: (data: CreateAlbumDTO) => Promise<void>;
  onClose: () => void;
  initialData?: CreateAlbumDTO;
}

export const AlbumFormModal = ({
  onSubmit,
  onClose,
  initialData
}: AlbumFormModalProps) => {
  const [formData, setFormData] = useState<CreateAlbumDTO>(initialData || {
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-md"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {initialData ? 'تعديل  معلومات الالبوم' : ' إضافة البوم جديد'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الالبوم *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vacation 2023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف الالبوم
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Our summer vacation in Spain"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              الغاء
            </button>
            <button
              type="submit"
              disabled={!formData.name || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  {initialData ? 'تحميل...' : 'إضافة...'}
                </>
              ) : (
                initialData ? 'تعديل الالبوم' : 'إضافة الالبوم'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};