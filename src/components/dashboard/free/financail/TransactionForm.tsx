import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    Tag,
    Image as ImageIcon,
    X,
    Receipt,
    Loader2,
    CircleArrowUp,
    CircleArrowDown
} from 'lucide-react';
import type { TransactionFormProps, TransactionFormValues } from '../../../../types/financial';
import { useEffect } from 'react';

const transactionSchema = yup.object().shape({
    name: yup.string().required('اسم المعاملة مطلوب'),
    amount: yup
        .number()
        .required('المبلغ مطلوب')
        .positive('يجب أن يكون المبلغ موجبًا'),
    date: yup.string().required('التاريخ مطلوب'),
    category: yup.string().required('الفئة مطلوبة'),
    type: yup.string().required('النوع مطلوب').oneOf(['income', 'expense']),
    description: yup.string().optional(),
    image: yup.mixed()
        .nullable()
        .test(
            'fileSize',
            'حجم الملف كبير جدًا (الحد الأقصى 5MB)',
            (value) => !value ||
                (typeof value === 'string') ||
                (value instanceof File && value.size <= 5 * 1024 * 1024)
        )
        .test(
            'fileType',
            'نوع الملف غير مدعوم (يجب أن يكون صورة)',
            (value) => !value ||
                (typeof value === 'string') ||
                (value instanceof File && value.type.startsWith('image/'))
        )
});

export const TransactionForm = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
}: TransactionFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<TransactionFormValues>({
        resolver: yupResolver(transactionSchema as any),
        defaultValues: {
            name: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            category: '',
            type: 'expense',
            description: '',
            image: null,
        },
        values: initialData
    });

    const type = watch('type');
    const image = watch('image');

    const handleFormSubmit = async (data: TransactionFormValues) => {
        try {
            await onSubmit(data);
            if (mode === 'add') reset();
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setValue('image', e.target.files[0], { shouldValidate: true });
        }
    };

    const removeImage = () => {
        setValue('image', null, { shouldValidate: true });
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden w-full"
            style={{ margin: '0 auto' }}
        >
            {/* Invoice Header */}
            <div className={`relative p-6 overflow-hidden`}>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                        <Receipt className="h-10 w-10 text-primary" />
                        <h2 className="mx-3 text-2xl font-bold text-primary font-cairo">
                            {type === 'income' ? 'سجل إيراد' : 'سجل مصروف'}
                        </h2>
                    </div>
                    <div className="text-color-2 font-cairo">
                        {new Date().toLocaleDateString('ar-EG-u-nu-latn', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
                {/* Receipt Image Field */}
                <div>
                    <label className="block text-md font-medium text-color-2 underline mb-1">
                        صورة الإيصال (اختياري)
                    </label>
                    <div className="mt-1 flex flex-col items-center mb-8">
                        {image ? (
                            <div className="relative group">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-64 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600"
                                >
                                    {image instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Receipt preview"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <img
                                            src={image}
                                            alt="Receipt"
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </motion.div>
                                <motion.button
                                    type="button"
                                    onClick={removeImage}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        ) : (
                            <label
                                htmlFor="image"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">اضغط لرفع صورة</span> أو اسحبها هنا
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG (الحد الأقصى 5MB)
                                    </p>
                                </div>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                    <AnimatePresence>
                        {errors.image && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-1 text-sm text-red-600 flex items-center"
                            >
                                <AlertCircle className="w-4 h-4 mx-1" />
                                {errors.image.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                    {/* Right Column - Arabic fields first */}
                    <div className="space-y-5">
                        {/* Type Field */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-color-2 dark:border-gray-700">
                            <label className="block text-md font-medium text-color-2 underline mb-3 font-cairo">
                                نوع المعاملة
                            </label>
                            <div className="flex gap-4 justify-end">
                                <label className="inline-flex items-center">
                                    <span className="mx-2 gap-1 flex items-center dark:text-white font-cairo">
                                        <CircleArrowUp className='text-green-600 w-5 h-5' />
                                        إيراد
                                    </span>
                                    <input
                                        type="radio"
                                        value="income"
                                        {...register('type')}
                                        className="form-radio h-5 w-5 text-emerald-600 border-2 border-gray-300 focus:ring-emerald-500"
                                    />
                                </label>
                                <label className="inline-flex items-center">
                                    <span className="mx-2 flex gap-1 items-center dark:text-white font-cairo">
                                        <CircleArrowDown className='text-red-600 w-5 h-5' />
                                        مصروف
                                    </span>
                                    <input
                                        type="radio"
                                        value="expense"
                                        {...register('type')}
                                        className="form-radio h-5 w-5 text-rose-600 border-2 border-gray-300 focus:ring-rose-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-color-2 dark:border-gray-700">
                            <label className="block text-md font-medium text-color-2 underline mb-2 font-cairo">
                                اسم المعاملة
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register('name')}
                                    className={`block w-full pr-10 pl-3 py-2.5 border ${errors.name
                                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                                        } rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-cairo text-right`}
                                    placeholder="أدخل اسم المعاملة"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <FileText className="w-5 h-5 text-amber-500" />
                                </div>
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-2 text-sm text-rose-600 flex items-center justify-end font-cairo"
                                    >
                                        {errors.name.message}
                                        <AlertCircle className="w-4 h-4 mx-1" />
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Amount Field */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-color-2 dark:border-gray-700">
                            <label className="block text-md font-medium text-color-2 underline mb-2 font-cairo">
                                المبلغ
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('amount')}
                                    className={`block w-full pr-10 pl-3 py-2.5 border ${errors.amount
                                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                                        } rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-cairo text-right`}
                                    placeholder="0.00"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">

                                    <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-4 h-4' />                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                </div>
                            </div>
                            <AnimatePresence>
                                {errors.amount && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-2 text-sm text-rose-600 flex items-center justify-end font-cairo"
                                    >
                                        {errors.amount.message}
                                        <AlertCircle className="w-4 h-4 mx-1" />
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Left Column */}
                    <div className="items-center grid grid-cols-2 gap-2 rounded-xl border border-color-2 ">
                        {/* Date Field */}
                        <div className="bg-white dark:bg-gray-800 p-4 dark:border-gray-700">
                            <label className="block text-md font-medium text-color-2 underline mb-2 font-cairo">
                                التاريخ
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...register('date')}
                                    className={`block w-full pr-10 pl-3 py-2.5 border ${errors.date
                                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                                        } rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-cairo`}
                                />
                            </div>
                            <AnimatePresence>
                                {errors.date && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-2 text-sm text-rose-600 flex items-center justify-end font-cairo"
                                    >
                                        {errors.date.message}
                                        <AlertCircle className="w-4 h-4 mx-1" />
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Category Field */}
                        <div className="bg-white dark:bg-gray-800 p-4 dark:border-gray-700">
                            <label className="block text-md font-medium text-color-2 underline mb-2 font-cairo">
                                الفئة
                            </label>
                            <div className="relative">
                                <select
                                    {...register('category')}
                                    className={`block w-full pr-10 pl-3 py-2.5 border ${errors.category
                                        ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
                                        : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                                        } rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-cairo appearance-none`}
                                >
                                    <option value="">اختر الفئة</option>
                                    <option value="donations">تبرعات</option>
                                    <option value="other">أخرى</option>
                                </select>
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Tag className="w-5 h-5 text-amber-500" />
                                </div>
                            </div>
                            <AnimatePresence>
                                {errors.category && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-2 text-sm text-rose-600 flex items-center justify-end font-cairo"
                                    >
                                        {errors.category.message}
                                        <AlertCircle className="w-4 h-4 mx-1" />
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                    {/* Description Field */}


                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-color-2 dark:border-gray-700">
                        <label className="block text-md font-medium text-color-2 underline mb-2 font-cairo">
                            الوصف (اختياري)
                        </label>
                        <div className="relative">
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="block w-full pr-3 pl-3 py-2.5 border border-gray-300 focus:ring-amber-500 focus:border-amber-500 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-cairo text-right"
                                placeholder="أضف وصفًا للمعاملة..."
                            />
                        </div>
                    </div>

                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-color-2 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors font-cairo"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 rounded-lg font-medium shadow-sm flex items-center bg-primary/90 hover:bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed transition-colors font-cairo`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mx-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mx-2" />
                                {mode === 'add' ? 'إضافة معاملة' : 'حفظ التغييرات'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};