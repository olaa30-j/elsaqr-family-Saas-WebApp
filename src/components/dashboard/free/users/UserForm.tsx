import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useCreateUserMutation, useUpdateUserMutation } from '../../../../store/api/usersApi';
import { BaseForm } from '../../../shared/BaseForm';
import { userSchema, type UserFormValues } from '../../../../types/schemas';
import { useParams } from 'react-router-dom';
import { useGetAllRolesQuery } from '../../../../store/api/roleApi';
import { familyRelationships } from '../../../../types/user';
import { useFamilyBranches } from '../../../../hooks/useFamilyBranches';

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

interface UserFormProps {
    defaultValues?: Partial<UserFormValues>;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
    defaultValues,
    onSuccess,
    onCancel,
    isEditing = false,
}) => {
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const { data: rolesResponse, isLoading: isRolesLoading } = useGetAllRolesQuery();
    const { familyBranches } = useFamilyBranches();

    const availableRoles = useMemo(() => {
        return rolesResponse?.data || [];
    }, [rolesResponse]);

    const { userId } = useParams<{ userId: string }>();

    const handleSubmit = async (data: UserFormValues) => {
        try {
            const requestData = {
                ...data,
                role: [data.role]
            };

            if (isEditing && userId) {
                await updateUser({ id: userId, data: requestData }).unwrap();
                toast.success("تم تحديث المستخدم بنجاح");
            } else {
                await createUser({ data: requestData }).unwrap();
                toast.success("تم إنشاء المستخدم بنجاح");
            }

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
            isEditing={isEditing}
            formTitle={isEditing ? 'تعديل مستخدم' : 'إنشاء مستخدم جديد'}
            formDescription={isEditing ? 'قم بتعديل بيانات المستخدم' : 'أدخل بيانات المستخدم الجديد'}
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
                                disabled={isUpdating || isCreating}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    كلمة المرور
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>
                        )}

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
                                    disabled={isUpdating || isCreating}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Family Branch Field */}
                        <div className="space-y-2">
                            <label htmlFor="familyBranch" className="block text-sm font-medium text-gray-700">
                                فرع العائلة
                            </label>
                            <select
                                id="familyBranch"
                                {...register('familyBranch')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating}
                            >
                                <option value="">اختر فرع العائلة</option>
                                {familyBranches.map((branch: any, index: any) => (
                                    <option key={index} value={branch.value}>{branch.label}</option>
                                ))}
                            </select>
                            {errors.familyBranch && (
                                <p className="mt-1 text-sm text-red-600">{errors.familyBranch.message}</p>
                            )}
                        </div>

                        {/* Family Relationship Field */}
                        <div className="space-y-2">
                            <label htmlFor="familyRelationship" className="block text-sm font-medium text-gray-700">
                                صلة القرابة
                            </label>
                            <select
                                id="familyRelationship"
                                {...register('familyRelationship')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating}
                            >
                                <option value="">اختر الصلة</option>
                                {familyRelationships.map((relation) => (
                                    <option key={relation.value} value={relation.value}>
                                        {relation.label === "الجد الأعلى" ? `${relation.label} (رأس الأسرة)` : relation.label}
                                    </option>
                                ))}
                            </select>
                            {errors.familyRelationship && (
                                <p className="mt-1 text-sm text-red-600">{errors.familyRelationship.message}</p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                العنوان
                            </label>
                            <textarea
                                id="address"
                                {...register('address')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={1}
                                disabled={isUpdating || isCreating}
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                            )}
                        </div>

                        {/* Role Field - Dynamic */}
                        <div className="space-y-2">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                الدور
                            </label>
                            {isRolesLoading ? (
                                <div className="animate-pulse rounded-md bg-gray-200 h-10 w-full"></div>
                            ) : (
                                <select
                                    id="role"
                                    {...register('role')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating || isRolesLoading}
                                >
                                    <option value="">اختر الدور</option>
                                    {availableRoles.map((role: string, index: number) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Status Field */}
                        <div className="space-y-2">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                الحالة
                            </label>
                            <select
                                id="status"
                                {...register('status')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating}
                            >
                                <option value="مقبول">مقبول</option>
                                <option value="قيد الانتظار">قيد الانتظار</option>
                                <option value="مرفوض">مرفوض</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </BaseForm>
    );
};

export default UserForm;