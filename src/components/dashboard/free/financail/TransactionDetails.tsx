import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TransactionForm } from './TransactionForm';
import { Edit2, ArrowLeft, Clock, User, Info, X } from 'lucide-react';
import {
    useUpdateTransactionMutation,
    useGetTransactionByIdQuery
} from '../../../../store/api/financialApi';
import type { TransactionFormValues } from '../../../../types/financial';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    console.log(error);

    const {
        data: transaction,
        isError,
        error: fetchError
    } = useGetTransactionByIdQuery(id!, {
        skip: !id
    });

    const [updateTransaction] = useUpdateTransactionMutation();

    useEffect(() => {
        if (isError) {
            setError(fetchError instanceof Error ? fetchError.message : 'فشل تحميل بيانات المعاملة');
        }
    }, [isError, fetchError]);

    const handleSubmit = async (formData: TransactionFormValues) => {
        try {
            if (!id) throw new Error('معرف المعاملة مفقود');

            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'image') {
                        if (value instanceof File) {
                            formDataObj.append(key, value);
                        } else if (typeof value === 'string') {
                            formDataObj.append(key, value);
                        }
                    } else {
                        formDataObj.append(key, String(value));
                    }
                }
            });

            await updateTransaction({ id: transaction.data._id, formData: formDataObj }).unwrap();
            navigate('/financial');
        } catch (err) {
            console.error('خطأ في تحديث المعاملة:', err);
            setError(err instanceof Error ? err.message : 'فشل تحديث المعاملة');
        }
    };

    const handleCancel = () => {
        navigate('/financial');
    };


    if (!transaction) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-white dark:from-gray-900 dark:to-gray-800">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md border border-primary dark:border-amber-800"
                >
                    <Info className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-2 font-arabic">جارى تحميل البيانات</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 font-arabic">لم يتم العثور على المعاملة المطلوبة</p>
                    <motion.button
                        onClick={() => navigate('/financial')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-amber-100 dark:bg-gray-700 text-amber-800 dark:text-amber-200 rounded-md hover:bg-amber-200 dark:hover:bg-gray-600 font-arabic"
                    >
                        العودة إلى القائمة
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-b from-primary/10 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen py-8 mb-20">
            <div className="container mx-auto px-4">
                {/* Header with Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-color-2 dark:text-white font-arabic text-center">
                        تفاصيل المعاملة المالية
                    </h1>

                    <motion.button
                        onClick={() => navigate('/financial')}
                        whileHover={{ x: -5 }}
                        className="flex items-center text-primary font-arabic"
                    >
                        رجوع
                        <ArrowLeft className="w-5 h-5 mx-1" />

                    </motion.button>
                    {/* <motion.button
                        onClick={() => setShowSidebar(!showSidebar)}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-white border-2 border-primary text-primary rounded-md text-sm font-arabic"
                    >
                        {showSidebar ? 'إخفاء التعليمات' : 'عرض التعليمات'}
                    </motion.button> */}
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Form */}
                    <motion.div
                        layout
                        className={`${showSidebar ? 'lg:w-2/3' : 'w-full'} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-primary dark:border-gray-700`}
                    >
                        <TransactionForm
                            mode="edit"
                            initialData={{
                                _id: transaction.data._id,
                                name: transaction.data.name,
                                amount: transaction.data.amount,
                                type: transaction.data.type,
                                date: transaction.data.date,
                                category: transaction.data.category,
                                description: transaction.data.description,
                                image: transaction.data.image
                            }}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </motion.div>

                    {/* Sidebar */}
                    <AnimatePresence>
                        {showSidebar && (
                            <motion.aside
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="lg:w-1/3"
                            >
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700">
                                    {/* Header with Guidance Icon */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white font-arabic flex items-center">
                                            <Info className="w-5 h-5 ml-2 text-amber-600" />
                                            دليل الإرشاد
                                        </h2>
                                        <motion.button
                                            whileHover={{ rotate: 90 }}
                                            onClick={() => setShowSidebar(false)}
                                            className="text-gray-400 hover:text-amber-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </div>

                                    {/* Guidance Cards */}
                                    <div className="space-y-4">
                                        {/* Status Guidance */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-4 bg-amber-50 dark:bg-gray-700 rounded-lg border-l-4 border-amber-400"
                                        >
                                            <h3 className="font-medium text-amber-700 dark:text-amber-300 mb-2 font-arabic flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-2 ${transaction.data.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                حالة المعاملة
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
                                                {transaction.data.status === 'completed'
                                                    ? 'المعاملة مكتملة بنجاح. يمكنك تعديلها ولكن سيتم تغيير حالتها إلى "تحت المراجعة"'
                                                    : 'المعاملة قيد المعالجة. الرجاء مراجعة المدير المالي إذا استمرت هذه الحالة أكثر من 48 ساعة'}
                                            </p>
                                        </motion.div>

                                        {/* Editing Guidance */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400"
                                        >
                                            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2 font-arabic flex items-center">
                                                <Edit2 className="w-4 h-4 ml-1 mr-2" />
                                                نصائح التعديل
                                            </h3>
                                            <ul className="text-sm text-gray-600 dark:text-gray-300 font-arabic space-y-2 list-disc pr-5">
                                                <li>تأكد من صحة المبلغ وتاريخ المعاملة</li>
                                                <li>أرفق صورة واضحة للإيصال إذا كان متاحاً</li>
                                                <li>استخدم الوصف لذكر أي تفاصيل إضافية</li>
                                            </ul>
                                        </motion.div>

                                        {/* History Info */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-400"
                                        >
                                            <div className="flex items-start mb-2">
                                                <Clock className="w-4 h-4 mt-0.5 ml-1 text-emerald-600 dark:text-emerald-400" />
                                                <div>
                                                    <h3 className="font-medium text-emerald-700 dark:text-emerald-300 font-arabic">
                                                        السجل الزمني
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                                                        أنشئت في {new Date(transaction.data.createdAt).toLocaleString('ar-EG')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                                                        آخر تعديل {new Date(transaction.data.updatedAt).toLocaleString('ar-EG')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Creator Info */}
                                        {transaction.data.createdBy && (
                                            <motion.div
                                                whileHover={{ y: -2 }}
                                                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400"
                                            >
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 ml-1 text-purple-600 dark:text-purple-400" />
                                                    <div className="mr-2">
                                                        <h3 className="font-medium text-purple-700 dark:text-purple-300 font-arabic">
                                                            مسجل بواسطة
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
                                                            {transaction.data.createdBy.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="pt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowSidebar(false)}
                                                className="w-full py-2 bg-amber-100 dark:bg-gray-700 text-amber-800 dark:text-amber-200 rounded-lg font-arabic text-sm"
                                            >
                                                فهمت، إغلاق الدليل
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default TransactionDetails;