import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../../ui/Modal';
import type { Transaction } from '../../../../types/financial';

interface DeleteConfirmationModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Modal for confirming transaction deletion with enhanced design.
 * 
 * @component
 * @param {DeleteConfirmationModalProps} props - Component props
 */
const DeleteConfirmationModal = ({ transaction, onClose, onConfirm }: DeleteConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {transaction && (
                <Modal
                    isOpen={!!transaction}
                    onClose={onClose}
                    title="حذف المعاملة المالية"
                    extraStyle="bg-red-600 underline text-white"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="p-6"
                    >
                        <div className="flex items-start gap-2">
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
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    حذف معاملة: {transaction.name}
                                </h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>هل أنت متأكد من رغبتك في حذف هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
                            >
                                إلغاء
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: "#dc2626" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onConfirm}
                                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                نعم، احذف
                            </motion.button>
                        </div>
                    </motion.div>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;