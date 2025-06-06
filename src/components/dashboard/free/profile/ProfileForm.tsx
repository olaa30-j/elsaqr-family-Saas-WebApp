import React from 'react';
import { toast } from 'react-toastify';
import { BaseForm } from '../../../shared/BaseForm';
import { useUpdateUserMutation } from '../../../../store/api/usersApi';
import { useAppSelector } from '../../../../store/store';
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
    defaultValues: UserFormValues;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    defaultValues,
    onSuccess,
    onCancel,
    isEditing = false,
}) => {
    const user = useAppSelector(state => state.auth.user);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const handleSubmit = async (data: UserFormValues) => {
        try {
            const requestData = {
                email: data.email,
                phone: data.phone,
                address: data.address,
                familyBranch: data.familyBranch,
                familyRelationship: data.familyRelationship,
                status: data.status,
                role: data.role
            };

            console.log('Data being sent to server:', requestData);

            if (user && user._id) {
                await updateUser({
                    id: user._id,
                    data: requestData
                }).unwrap();

                toast.success("تم تحديث الملف الشخصي بنجاح");
                onSuccess?.();
            }
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
            onCancel={onCancel}
            isEditing={isEditing}
            schema={userSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            formTitle="الملف الشخصي"
            formDescription="بيانات المستخدم الأساسية"
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

                        {/* Hidden Fields */}
                        <input
                            type="hidden"
                            {...register('familyBranch')}
                        />
                        <input
                            type="hidden"
                            {...register('familyRelationship')}
                        />
                        <input
                            type="hidden"
                            {...register('status')}
                        />
                        <input
                            type="hidden"
                            {...register('role')}
                        />

                        {/* Address Field */}
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                العنوان
                            </label>
                            <textarea
                                id="address"
                                {...register('address')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={3}
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