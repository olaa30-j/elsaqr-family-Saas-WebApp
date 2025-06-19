import React from 'react';
import { toast } from 'react-toastify';
import { useCreateBranchMutation, useUpdateBranchMutation } from '../../../../store/api/branchApi';
import { BaseForm } from '../../../shared/BaseForm';
import { branchSchema, type BranchFormValues } from '../../../../types/schemas';
import { useGetMembersQuery } from "../../../../store/api/memberApi";

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

interface BranchFormProps {
    defaultValues?: Partial<BranchFormValues>;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
    branchId? :string
}

const BranchForm: React.FC<BranchFormProps> = ({
    defaultValues,
    onSuccess,
    onCancel,
    branchId,
    isEditing = false,
}) => {
    const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
    const { data: allMembers, isLoading: isUsersLoading } = useGetMembersQuery({
        page: 1,
        limit: 500
    });

    const Allmembers = allMembers?.data.map((m: any) => ({
        value: m._id,
        label: `${m.fname} ${m.lname}`
    })) || [];


    const handleSubmit = async (data: BranchFormValues) => {
        try {
            if (isEditing && branchId) {
                await updateBranch({ _id: branchId, updateData: data }).unwrap();
                toast.success("تم تحديث الفرع بنجاح");
            } else {
                await createBranch({branchData: data}).unwrap();
                toast.success("تم إنشاء الفرع بنجاح");
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
            schema={branchSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={isEditing}
            formTitle={isEditing ? 'تعديل فرع' : 'إنشاء فرع جديد'}
            formDescription={isEditing ? 'قم بتعديل بيانات الفرع' : 'أدخل بيانات الفرع الجديد'}
        >
            {({ register, formState: { errors } }) => (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* اسم الفرع */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                اسم الفرع
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* مدير الفرع */}
                        <div className="space-y-2">
                            <label htmlFor="branchOwner" className="block text-sm font-medium text-gray-700">
                                مدير الفرع
                            </label>
                            <select
                                id="branchOwner"
                                {...register('branchOwner')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating || isUsersLoading}
                            >
                                <option value="">اختر مدير الفرع</option>
                                {Allmembers.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                            {errors.branchOwner && (
                                <p className="mt-1 text-sm text-red-600">{errors.branchOwner.message}</p>
                            )}
                        </div>

                        {/* الظهور */}
                        <div className="space-y-2">
                            <label htmlFor="show" className="block text-sm font-medium text-gray-700">
                                الظهور
                            </label>
                            <select
                                id="show"
                                {...register('show')}
                                className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isUpdating || isCreating}
                            >
                                <option value="true">ظاهر</option>
                                <option value="false">مخفي</option>
                            </select>
                            {errors.show && (
                                <p className="mt-1 text-sm text-red-600">{errors.show.message}</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </BaseForm>
    );
};

export default BranchForm;