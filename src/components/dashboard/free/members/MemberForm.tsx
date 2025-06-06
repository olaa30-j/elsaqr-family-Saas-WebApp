import React from 'react';
import { toast } from 'react-toastify';
import { BaseForm } from '../../../shared/BaseForm';
import { memberSchema, type MemberFormValues } from '../../../../types/schemas';
import { useParams } from 'react-router-dom';
import { useCreateMemberMutation, useUpdateMemberMutation } from '../../../../store/api/memberApi';

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

interface MemberFormProps {
    defaultValues?: Partial<MemberFormValues>;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({
    defaultValues,
    onSuccess,
    onCancel,
    isEditing = false,
}) => {
    const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
    const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
    const { memberId } = useParams<{ memberId: string }>();

    const handleSubmit = async (data: MemberFormValues) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'image' && value instanceof File) {
                    // هنا نتعامل مع File مباشرة وليس FileList
                    formData.append(key, value);
                } else if (key === 'wives' && Array.isArray(value)) {
                    value.forEach((wife, index) => {
                        formData.append(`wives[${index}]`, wife);
                    });
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            if (isEditing && memberId) {
                await updateMember({ id: memberId, data: formData }).unwrap();
                toast.success("تم تحديث بيانات العضو بنجاح");
            } else {
                await createMember({ formData }).unwrap();
                toast.success("تم إضافة العضو بنجاح");
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
            schema={memberSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={isEditing}
            formTitle={isEditing ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}
            formDescription={isEditing ? 'قم بتعديل بيانات العضو' : 'أدخل بيانات العضو الجديد'}
        >
            {({ register, formState: { errors }, setValue }) => {
                // const gender = watch('gender');
                // const familyRelationship = watch('familyRelationship');

                const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                        setValue('image', e.target.files[0]);
                    } else {
                        setValue('image', "");
                    }
                };

                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* الاسم الأول */}
                            <div className="space-y-2">
                                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">
                                    الاسم الأول
                                </label>
                                <input
                                    id="fname"
                                    type="text"
                                    {...register('fname')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.fname && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fname.message}</p>
                                )}
                            </div>

                            {/* الاسم الأخير */}
                            <div className="space-y-2">
                                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">
                                    الاسم الأخير
                                </label>
                                <input
                                    id="lname"
                                    type="text"
                                    {...register('lname')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.lname && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lname.message}</p>
                                )}
                            </div>

                            {/* فرع العائلة */}
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
                                    <option value="الفرع الأول">الفرع الأول</option>
                                    <option value="الفرع الثاني">الفرع الثاني</option>
                                    <option value="الفرع الثالث">الفرع الثالث</option>
                                </select>
                                {errors.familyBranch && (
                                    <p className="mt-1 text-sm text-red-600">{errors.familyBranch.message}</p>
                                )}
                            </div>

                            {/* صلة القرابة */}
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
                                    <option value="">اختر صلة القرابة</option>
                                    <option value="ابن">ابن</option>
                                    <option value="ابنة">ابنة</option>
                                    <option value="زوج">زوج</option>
                                    <option value="زوجة">زوجة</option>
                                    <option value="حفيد">حفيد</option>
                                    <option value="أخرى">أخرى</option>
                                </select>
                                {errors.familyRelationship && (
                                    <p className="mt-1 text-sm text-red-600">{errors.familyRelationship.message}</p>
                                )}
                            </div>

                            {/* الجنس */}
                            <div className="space-y-2">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    الجنس
                                </label>
                                <select
                                    id="gender"
                                    {...register('gender')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                >
                                    <option value="">اختر الجنس</option>
                                    <option value="ذكر">ذكر</option>
                                    <option value="أنثى">أنثى</option>
                                </select>
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                                )}
                            </div>

                            {/* الزوج (يظهر فقط إذا كانت الأنثى زوجة) */}
                            {/* {gender === 'أنثى' && familyRelationship === 'زوجة' && (
                                <div className="space-y-2">
                                    <label htmlFor="husband" className="block text-sm font-medium text-gray-700">
                                        الزوج
                                    </label>
                                    <input
                                        id="husband"
                                        type="text"
                                        {...register('husband')}
                                        className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isUpdating || isCreating}
                                    />
                                    {errors.husband && (
                                        <p className="mt-1 text-sm text-red-600">{errors.husband.message}</p>
                                    )}
                                </div>
                            )} */}

                            {/* الزوجات (يظهر فقط إذا كان الذكر زوج) */}
                            {/* {gender === 'ذكر' && familyRelationship === 'زوج' && (
                                <div className="space-y-2">
                                    <label htmlFor="wives" className="block text-sm font-medium text-gray-700">
                                        الزوجات (أدخل الأرقام مفصولة بفواصل)
                                    </label>
                                    <input
                                        id="wives"
                                        type="text"
                                        {...register('wives')}
                                        className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isUpdating || isCreating}
                                    />
                                    {errors.wives && (
                                        <p className="mt-1 text-sm text-red-600">{errors.wives.message}</p>
                                    )}
                                </div>
                            )}
 */}
                            {/* تاريخ الميلاد */}
                            <div className="space-y-2">
                                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                                    تاريخ الميلاد
                                </label>
                                <input
                                    id="birthday"
                                    type="date"
                                    {...register('birthday')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.birthday && (
                                    <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
                                )}
                            </div>

                            {/* تاريخ الوفاة */}
                            <div className="space-y-2">
                                <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700">
                                    تاريخ الوفاة (إن وجد)
                                </label>
                                <input
                                    id="deathDate"
                                    type="date"
                                    {...register('deathDate')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.deathDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.deathDate.message}</p>
                                )}
                            </div>

                            {/* ملخص */}
                            <div className="space-y-2 col-span-2">
                                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                                    ملخص
                                </label>
                                <textarea
                                    id="summary"
                                    {...register('summary')}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.summary && (
                                    <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                                )}
                            </div>

                            {/* صورة */}
                            <div className="space-y-2 col-span-2">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    صورة العضو
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isUpdating || isCreating}
                                />
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                                )}
                            </div>
                        </div>
                    </>
                );
            }}
        </BaseForm>
    );
};

export default MemberForm;