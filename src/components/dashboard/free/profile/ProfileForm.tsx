import React from 'react';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from '../../../../store/api/usersApi';
import { BaseForm } from '../../../shared/BaseForm';
import { userSchema, type UserFormValues } from '../../../../types/schemas';

type ErrorWithMessage = {
    message: string;
};

type FetchBaseQueryError = {
    status: number;
    data: unknown;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return typeof error === 'object' && error !== null && 'message' in error;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error !== null && 'status' in error;
}

interface ProfileFormProps {
    defaultValues: Partial<UserFormValues>;
    onSuccess?: () => void;
    onCancel?: () => void;
    userId: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    defaultValues,
    onSuccess,
    onCancel,
    userId,
}) => {
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const handleSubmit = async (data: UserFormValues) => {
        try {
            const requestData = {
                ...defaultValues,  
                email: data.email, 
                phone: data.phone,
                address: data.address,
                role: Array.isArray(defaultValues.role) 
                    ? defaultValues.role 
                    : [defaultValues.role || 'مستخدم']
            };

            await updateUser({ 
                id: userId, 
                data: requestData 
            }).unwrap();
            
            toast.success("تم تحديث الملف الشخصي بنجاح");
            onSuccess?.();
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                const errorData = error.data as { message?: string };
                toast.error(errorData.message || "حدث خطأ في الخادم");
            } else if (isErrorWithMessage(error)) {
                toast.error(error.message);
            } else {
                toast.error("حدث خطأ غير معروف");
            }
            console.error("تفاصيل الخطأ:", error);
        }
    };

    return (
        <BaseForm
            schema={userSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={true}
            formTitle='بيانات الحساب'
            formDescription='قم بتعديل بيانات حسابك'
        >
            {({ register, formState: { errors } }) => (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                رقم الهاتف
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">+966</span>
                                </div>
                                <input
                                    id="phone"
                                    type="tel"
                                    {...register('phone')}
                                    className="block w-full pl-16 rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Address Field (full width) */}
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                العنوان
                            </label>
                            <textarea
                                id="address"
                                {...register('address')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={2}
                                disabled={isUpdating}
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </BaseForm>
    );
};

export default ProfileForm;