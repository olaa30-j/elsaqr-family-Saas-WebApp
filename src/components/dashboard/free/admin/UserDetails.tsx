import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGetUserQuery, useUpdateUserMutation, useCreateMemberMutation } from '../../../../store/api/usersApi';
import InputField from '../../../ui/InputField';
import SelectField from '../../../ui/SelectField';
import PhoneInput from '../../../ui/PhoneInput';
import DatePickerField from '../../../ui/DatePickerField';
import { familyBranches, familyRelationships, roleOptions, statusOptions, type IUpdateUserDTO } from '../../../../types/user';
import { useEffect, useState, type ChangeEvent } from 'react';
import PermissionsSection from './UserPermissionsForm';
import { ArrowLeft } from 'lucide-react';

const debug = console.log;


interface UserDetailsPageProps {
    isModal?: boolean;
    onSuccess?: () => void;
}

const UserDetailsPage = ({ isModal = false, onSuccess }: UserDetailsPageProps) => {
    const { userId } = useParams<{ userId: string }>();
    const isCreateMode = !userId;
    const navigate = useNavigate();
    const userSchema = yup.object({
        fname: yup.string().required('الاسم الأول مطلوب'),
        lname: yup.string().required('الاسم الأخير مطلوب'),
        email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
        phone: yup.string()
            .required('رقم الهاتف مطلوب')
            .matches(/^5\d{8}$/, 'يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5'),
        familyBranch: yup.string().required('فرع العائلة مطلوب'),
        familyRelationship: yup.string().required('صلة القرابة مطلوبة'),
        address: yup.string().required('العنوان مطلوب'),
        birthday: yup.date().required('تاريخ الميلاد مطلوب').nullable(),
        status: yup.string().required('حالة العضو مطلوبة'),
        role: yup.string().required('دور العضو مطلوب'),
        image: yup.mixed()
            .nullable()
            .notRequired()
            .test('is-file-or-string', 'الصورة يجب أن تكون ملفًا أو رابطًا', (value) => {
                if (value === undefined || value === null) return true;
                return value instanceof File || typeof value === 'string';
            }),
        ...(isCreateMode && {
            password: yup.string()
                .required('كلمة المرور مطلوبة')
                .min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف')
        })
    });

    const { data: user, isLoading, error: fetchError } = isCreateMode
        ? { data: null, isLoading: false, error: null }
        : useGetUserQuery(userId!);

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
    const [previewImage, setPreviewImage] = useState<string>('');

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<IUpdateUserDTO>({
        resolver: yupResolver(userSchema as any),
        defaultValues: {
            fname: '',
            lname: '',
            email: '',
            phone: '',
            familyBranch: '',
            familyRelationship: '',
            address: '',
            birthday: null,
            status: 'active',
            role: 'user',
            image: null,
            ...(isCreateMode && {
                password: ''
            })
        },
    });

    const currentImage = watch('image');
    const isProcessing = isUpdating || isCreating;

    useEffect(() => {
        if (!isCreateMode && user) {
            debug('[DEBUG] User data loaded:', user.data);
            reset({
                fname: user.data.fname,
                lname: user.data.lname,
                email: user.data.email,
                phone: user.data.phone,
                familyBranch: user.data.familyBranch,
                familyRelationship: user.data.familyRelationship,
                address: user.data.address,
                birthday: user.data.birthday,
                status: user.data.status,
                role: user.data.role,
                image: user.data.image || null,
            });
            setPreviewImage(user.data.image || '');
        }
    }, [user, reset, isCreateMode]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setValue('image', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit: SubmitHandler<IUpdateUserDTO> = async (data) => {
        debug('[DEBUG] Form submission started with data:', data);

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && key !== 'image' && key !== 'confirmPassword') {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        try {
            if (isCreateMode) {
                const result = await createMember(formData).unwrap();
                toast.success("تم إنشاء المستخدم بنجاح");

                if (isModal && onSuccess) {
                    onSuccess();
                    toast.success("تم إنشاء المستخدم بنجاح");

                } else {
                    navigate(`/admin/users/${result.data._id}`);
                }
            } else {
                const result = await updateUser({ id: userId!, formData }).unwrap();
                toast.success("تم تحديث بيانات المستخدم بنجاح");

                if (result.data?.image) {
                    setPreviewImage(result.data.image);
                }
            }
        } catch (error) {
            toast.error(isCreateMode ? "فشل في إنشاء المستخدم" : "فشل في تحديث البيانات");
        }
    };

    if (!isCreateMode && isLoading) return <div className="text-center py-8">جاري التحميل...</div>;
    if (!isCreateMode && fetchError) return <div className="text-center py-8">حدث خطأ أثناء جلب بيانات المستخدم</div>;
    if (!isCreateMode && !user) return <div className="text-center py-8">المستخدم غير موجود</div>;

    return (
        <div className={isModal ? "" : "container mx-auto p-4 max-w-4xl"}>
            <div className={`bg-white rounded-lg ${isModal ? "p-4" : "p-6"}`}>
                {!isModal && (
                    <Link to="/admin/users" className='flex gap-2 items-center justify-end text-primary w-full'>
                        رجوع
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                )}

                <h1 className={`text-xl font-bold text-primary text-center mb-4 ${isModal ? "" : "underline"}`}>
                    {isCreateMode ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}
                </h1>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        {previewImage && (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={
                                        typeof currentImage === 'string'
                                            ? previewImage
                                            : currentImage instanceof File
                                                ? URL.createObjectURL(currentImage)
                                                : previewImage
                                    }
                                    alt="User preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-primary file:text-white
                                          hover:file:bg-primary/90"
                                disabled={isProcessing}
                            />
                            {errors.image && (
                                <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>
                            )}
                            <p className="mt-2 text-sm text-gray-500">
                                أنواع الملفات المسموحة: JPEG, PNG, GIF. الحد الأقصى للحجم: 5MB
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="الاسم الأول"
                            id="fname"
                            type="text"
                            register={register}
                            error={errors.fname}
                            name="fname"
                            required
                        />

                        <InputField
                            label="الاسم الأخير"
                            id="lname"
                            type="text"
                            register={register}
                            error={errors.lname}
                            name="lname"
                            required
                        />

                        <InputField
                            label="البريد الإلكتروني"
                            id="email"
                            type="email"
                            register={register}
                            error={errors.email}
                            name="email"
                            required
                        />

                        {isCreateMode && (
                            <>
                                <InputField
                                    label="كلمة المرور"
                                    id="password"
                                    type="password"
                                    register={register}
                                    error={errors.password}
                                    name="password"
                                    required
                                />
                            </>
                        )}

                        <PhoneInput
                            label="رقم الهاتف"
                            name="phone"
                            id="phone"
                            register={register}
                            error={errors.phone}
                            required
                            control={control}
                            description="يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5"
                        />

                        <SelectField
                            label="فرع العائلة"
                            name="familyBranch"
                            id="familyBranch"
                            options={familyBranches}
                            register={register}
                            error={errors.familyBranch}
                            required
                        />

                        <SelectField
                            label="صلة القرابة بالعائلة"
                            name="familyRelationship"
                            id="familyRelationship"
                            options={familyRelationships}
                            register={register}
                            error={errors.familyRelationship}
                            required
                        />

                        <InputField
                            label="العنوان"
                            id="address"
                            type="text"
                            register={register}
                            error={errors.address}
                            name="address"
                            required
                        />

                        <DatePickerField
                            label="تاريخ الميلاد"
                            id="birthday"
                            control={control}
                            error={errors.birthday}
                            name="birthday"
                            maxDateToday
                        />

                        <SelectField
                            label="حالة العضو"
                            name="status"
                            id="status"
                            options={statusOptions}
                            register={register}
                            error={errors.status}
                            required
                        />

                        <SelectField
                            label="دور العضو"
                            name="role"
                            id="role"
                            options={roleOptions}
                            register={register}
                            error={errors.role}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={(!isDirty && !isCreateMode) || isProcessing}
                            className="inline-flex items-center justify-center text-white gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-11 rounded-md px-8 w-full py-3 text-lg disabled:bg-gray-400"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isCreating ? 'جاري الإنشاء...' : 'جاري الحفظ...'}
                                </>
                            ) : isCreateMode ? 'إنشاء مستخدم' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>

            {!isCreateMode && user && (
                <div>
                    <PermissionsSection user={user.data} />
                </div>
            )}
        </div>
    );
};

export default UserDetailsPage;