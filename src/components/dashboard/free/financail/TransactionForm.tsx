import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useCreateTransactionMutation } from '../../../../store/api/financialApi';
import InputField from '../../../ui/InputField';
import SelectField from '../../../ui/SelectField';
import DatePickerField from '../../../ui/DatePickerField';
import { FileX, Image } from 'lucide-react';

interface TransactionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const transactionSchema = yup.object().shape({
    name: yup.string().required('اسم المعاملة مطلوب'),
    amount: yup.number()
        .required('المبلغ مطلوب')
        .positive('يجب أن يكون المبلغ موجبًا')
        .typeError('يجب إدخال رقم صحيح'),
    type: yup.string().required('نوع المعاملة مطلوب'),
    category: yup.string().required('الفئة مطلوبة'),
    date: yup.date()
        .required('تاريخ المعاملة مطلوب')
        .max(new Date(), 'لا يمكن أن يكون التاريخ في المستقبل')
        .typeError('تاريخ غير صحيح'),
    description: yup.string().optional(),
    image: yup.mixed().optional()
});

const AddTransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onCancel }) => {
    const [createTransaction] = useCreateTransactionMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        register,
        watch
    } = useForm({
        resolver: yupResolver(transactionSchema),
        defaultValues: {
            name: '',
            amount: 0,
            type: 'expense',
            category: '',
            date: new Date(),
            description: '',
            image: undefined
        }
    });

    const transactionTypes = [
        { value: 'income', label: 'إيراد' },
        { value: 'expense', label: 'مصروف' }
    ];

    const transactionCategories = [
        { value: 'food', label: 'طعام' },
        { value: 'transport', label: 'مواصلات' },
        { value: 'housing', label: 'سكن' },
        { value: 'entertainment', label: 'ترفيه' },
        { value: 'salary', label: 'راتب' },
        { value: 'investment', label: 'استثمار' }
    ];

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('amount', data.amount.toString());
            formData.append('type', data.type);
            formData.append('category', data.category);
            formData.append('date', data.date.toISOString());
            formData.append('description', data.description || '');
            if (data.image) {
                formData.append('image', data.image);
            }

            await createTransaction(formData).unwrap();
            toast.success('تم إضافة المعاملة بنجاح');
            reset();
            onSuccess?.();
        } catch (error) {
            toast.error('فشل في إضافة المعاملة');
            console.error('Error adding transaction:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setValue('image', e.target.files[0]);
        }
    };

    const removeImage = () => {
        setValue('image', undefined);
    };

    const imageFile = watch('image');

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <InputField
                        label="اسم المعاملة"
                        id="name"
                        type="text"
                        register={register}
                        error={errors.name}
                        name="name"
                        required
                    />

                    <InputField
                        label="المبلغ"
                        id="amount"
                        type="text"
                        register={register}
                        error={errors.amount}
                        name="amount"
                        required
                    />



                    <SelectField
                        label="الفئة"
                        name="category"
                        id="category"
                        options={transactionCategories}
                        register={register}
                        error={errors.category}
                        required
                    />

                    <SelectField
                        label="نوع المعاملة"
                        name="type"
                        id="type"
                        options={transactionTypes}
                        register={register}
                        error={errors.category}
                        required
                    />


                    <DatePickerField
                        label="تاريخ الميلاد"
                        id="date"
                        control={control}
                        error={errors.date}
                        name="date"
                        maxDateToday
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">صورة الفاتورة (اختياري)</label>
                        <div className="flex items-center gap-2">
                            <label className="flex-1">
                                <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                                    <Image className="mr-2" />
                                    {imageFile ? 'تغيير الصورة' : 'اختر صورة'}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    <FileX />
                                </button>
                            )}
                        </div>
                        {imageFile && (
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    {/* {imageFile.} */}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <InputField
                    label="وصف المعاملة (اختياري)"
                    id="description"
                    type="text"
                    register={register}
                    error={errors.description}
                    name="description"
                    required
                    placeholder="أدخل وصفاً للمعاملة"
                />

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2"
                    >
                        حفظ المعاملة
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTransactionForm;