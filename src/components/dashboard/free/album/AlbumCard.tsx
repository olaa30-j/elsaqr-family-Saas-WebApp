import { motion } from 'framer-motion';
import { Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import type { Album, Image } from '../../../../types/album';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../../../ui/Modal';
import { toast } from 'react-toastify';

interface AlbumCardProps {
    album: Album;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (album: Album) => void;
}

export const AlbumCard = ({ album, onSelect, onEdit, onDelete }: AlbumCardProps) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const isPopulatedImage = (img: unknown): img is Image => {
        return typeof img === 'object' && img !== null && 'url' in img;
    };

    const firstImageUrl = album.images?.[0]
        ? isPopulatedImage(album.images[0])
            ? album.images[0].url
            : null
        : null;

    const handleSelectAlbum = (id: string) => {
        navigate(`/albums/${id}`);
        onSelect(id);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await onDelete(album._id);
            toast.success('تم حذف الألبوم بنجاح');
        } catch (error) {
            toast.error('فشل حذف الألبوم');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(album);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
                <div
                    className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSelectAlbum(album._id)}
                >
                    {firstImageUrl ? (
                        <img
                            src={firstImageUrl}
                            alt={album.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon size={48} />
                            <span className="mt-2 text-sm">No images yet</span>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg truncate">{album.name}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEditClick}
                                className="text-blue-500 hover:text-blue-700"
                                aria-label="Edit album"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="text-red-500 hover:text-red-700"
                                aria-label="Delete album"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {album.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {album.description}
                        </p>
                    )}

                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 ml-1">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>بواسطة: {album.createdBy.name || 'اسم المستخدم'}</span>
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 flex justify-between">
                        <span>{album.images?.length || 0} صور</span>
                        <span>{new Date(album.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={`حذف الألبوم ${album.name}`}
                extraStyle='bg-red-600'
            >
                <div className="space-y-4">
                    <div className=' flex gap-2 items-center'>
                        <div className="flex-shrink-0 mt-0.5">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full"
                            >
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </motion.div>
                        </div>
                        <p>هل أنت متأكد أنك تريد حذف هذا الألبوم؟ لا يمكن التراجع عن هذا الإجراء.</p>

                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                            تأكيد الحذف
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};