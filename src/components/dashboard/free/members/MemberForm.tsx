// import React, { useMemo } from 'react';
// import { toast } from 'react-toastify';
// import {
//     useCreateMemberMutation,
//     useGetMembersQuery,
//     useUpdateMemberMutation,
// } from '../../../../store/api/memberApi';
// import { BaseForm } from '../../../shared/BaseForm';
// import { memberSchema, type MemberFormValues } from '../../../../types/schemas';
// import { useParams } from 'react-router-dom';
// import Select from 'react-select';

// type ErrorWithMessage = {
//     message: string;
// };

// type FetchBaseQueryError = {
//     status: number;
//     data: unknown;
// };

// interface MemberOption {
//     value: string;
//     label: string;
// }

// function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
//     return typeof error === 'object' && error !== null && 'message' in error;
// }

// function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
//     return typeof error === 'object' && error !== null && 'status' in error;
// }

// interface MemberFormProps {
//     defaultValues?: Partial<MemberFormValues>;
//     onSuccess?: () => void;
//     onCancel?: () => void;
//     isEditing?: boolean;
// }

// const MemberForm: React.FC<MemberFormProps> = ({
//     defaultValues,
//     onSuccess,
//     onCancel,
//     isEditing = false,
// }) => {
//     const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
//     const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
//     const { memberId } = useParams<{ memberId: string }>();

//     const handleSubmit = async (formValues: MemberFormValues) => {
//         const formData = new FormData();

//         Object.entries(formValues).forEach(([key, value]) => {
//             if (value === undefined || value === null) {
//                 return;
//             }

//             if (key === 'wives' && Array.isArray(value)) {
//                 value.forEach(wife => {
//                     if (wife) {
//                         formData.append('wives[]', wife);
//                     }
//                 });
//             } else if (value instanceof Blob) {
//                 formData.append(key, value);
//             } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
//                 formData.append(key, value.toString());
//             } else if (value instanceof Date) {
//                 formData.append(key, value.toISOString());
//             }
//         });

//         try {
//             if (isEditing && memberId) {
//                 await updateMember({ id: memberId, data: formData }).unwrap();
//                 toast.success("تم تحديث العضو بنجاح");
//             } else {
//                 await createMember(formData).unwrap();
//                 toast.success("تم إنشاء العضو بنجاح");
//             }

//             onSuccess?.();
//         } catch (error) {
//             if (isFetchBaseQueryError(error)) {
//                 const errorData = error.data as { message?: string };
//                 toast.error(errorData.message || "حدث خطأ في الخادم");
//             } else if (isErrorWithMessage(error)) {
//                 toast.error(error.message);
//             } else {
//                 toast.error("حدث خطأ غير معروف");
//             }
//             console.error("تفاصيل الخطأ:", error);
//         }
//     };

//     return (
//         <BaseForm
//             schema={memberSchema}
//             defaultValues={defaultValues}
//             onSubmit={handleSubmit}
//             onCancel={onCancel}
//             isEditing={isEditing}
//             formTitle={isEditing ? 'تعديل عضو' : 'إضافة عضو جديد'}
//             formDescription={isEditing ? 'قم بتعديل بيانات العضو' : 'أدخل بيانات العضو الجديد'}
//         >
//             {({ register, formState: { errors }, watch, setValue }) => {
//                 const gender = watch('gender');
//                 const familyBranch = watch('familyBranch');
//                 const husband = watch('husband');
//                 const wives = watch('wives');

//                 const { data: membersData } = useGetMembersQuery(
//                     { familyBranch },
//                     { skip: !familyBranch }
//                 );

//                 const potentialHusbands = useMemo(() => {
//                     return membersData?.data?.filter(member =>
//                         member.gender === 'ذكر' &&
//                         member.familyRelationship === 'زوج'
//                     ) || [];
//                 }, [membersData]);

//                 const potentialWives = useMemo(() => {
//                     return membersData?.data?.filter(member =>
//                         member.gender === 'أنثى' &&
//                         member.familyRelationship === 'زوجة'
//                     ) || [];
//                 }, [membersData]);

//                 const husbandOptions = useMemo(() =>
//                     potentialHusbands.map(member => ({
//                         value: member._id,
//                         label: `${member.fname} ${member.lname}`
//                     })), [potentialHusbands]);

//                 const wivesOptions = useMemo(() =>
//                     potentialWives.map(member => ({
//                         value: member._id,
//                         label: `${member.fname} ${member.lname}`
//                     })), [potentialWives]);

//                 const selectedHusband = useMemo(() =>
//                     husbandOptions.find(option => option.value === husband),
//                     [husband, husbandOptions]);

//                 const selectedWives = useMemo(() =>
//                     wives?.map(wifeId => {
//                         const wife = potentialWives.find(m => m._id === wifeId);
//                         return wife ? {
//                             value: wife._id,
//                             label: `${wife.fname} ${wife.lname}`
//                         } : null;
//                     }).filter(Boolean) as MemberOption[] || [],
//                     [wives, potentialWives]);

//                 return (
//                     <>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2 md:col-span-2">
//                                 <label htmlFor="image" className="block text-sm font-medium text-gray-700">
//                                     صورة العضو (اختياري)
//                                 </label>
//                                 <div className="flex items-center gap-4">
//                                     {/* دائرة عرض الصورة */}
//                                     <div className="relative">
//                                         <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
//                                             {watch('image') ? (
//                                                 typeof watch('image') === 'string' ? (
//                                                     <img
//                                                         src={watch('image')}
//                                                         alt="صورة العضو"
//                                                         className="w-full h-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     // إذا كانت ملف جديد
//                                                     <img
//                                                         src={URL.createObjectURL(watch('image'))}
//                                                         alt="صورة العضو"
//                                                         className="w-full h-full object-cover"
//                                                     />
//                                                 )
//                                             ) : (
//                                                 <svg
//                                                     className="w-12 h-12 text-gray-400"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <path
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth={2}
//                                                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                                     />
//                                                 </svg>
//                                             )}
//                                         </div>

//                                         {/* زر تغيير الصورة */}
//                                         <label
//                                             htmlFor="image"
//                                             className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700"
//                                             title="تغيير الصورة"
//                                         >
//                                             <svg
//                                                 className="w-4 h-4"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                                                 />
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                                                 />
//                                             </svg>
//                                         </label>
//                                     </div>

//                                     {/* حقل إدخال الملف (مخفي) */}
//                                     <input
//                                         id="image"
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => {
//                                             const file = e.target.files?.[0];
//                                             if (file) {
//                                                 setValue('image', file);
//                                             }
//                                         }}
//                                         className="hidden"
//                                         disabled={isUpdating || isCreating}
//                                     />

//                                     {/* زر إزالة الصورة إذا كانت موجودة */}
//                                     {watch('image') && (
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setValue('image', null);
//                                                 // لإعادة تعيين قيمة الإدخال حتى يمكن اختيار نفس الملف مرة أخرى
//                                                 const input = document.getElementById('image') as HTMLInputElement;
//                                                 if (input) input.value = '';
//                                             }}
//                                             className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
//                                         >
//                                             <svg
//                                                 className="w-4 h-4"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 viewBox="0 0 24 24"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                                 />
//                                             </svg>
//                                             إزالة الصورة
//                                         </button>
//                                     )}
//                                 </div>
//                                 {errors.image && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
//                                 )}
//                             </div>
//                             {/* الاسم الأول */}
//                             <div className="space-y-2">
//                                 <label htmlFor="fname" className="block text-sm font-medium text-gray-700">
//                                     الاسم الأول*
//                                 </label>
//                                 <input
//                                     id="fname"
//                                     {...register('fname')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 />
//                                 {errors.fname && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.fname.message}</p>
//                                 )}
//                             </div>

//                             {/* الاسم الأخير */}
//                             <div className="space-y-2">
//                                 <label htmlFor="lname" className="block text-sm font-medium text-gray-700">
//                                     الاسم الأخير*
//                                 </label>
//                                 <input
//                                     id="lname"
//                                     {...register('lname')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 />
//                                 {errors.lname && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.lname.message}</p>
//                                 )}
//                             </div>

//                             {/* الفرع العائلي */}
//                             <div className="space-y-2">
//                                 <label htmlFor="familyBranch" className="block text-sm font-medium text-gray-700">
//                                     الفرع العائلي*
//                                 </label>
//                                 <select
//                                     id="familyBranch"
//                                     {...register('familyBranch')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 >
//                                     <option value="">اختر الفرع العائلي</option>
//                                     <option value="الفرع الاول">الفرع الاول</option>
//                                     <option value="الفرع الثانى">الفرع الثانى</option>
//                                     <option value="الفرع الثالث">الفرع الثالث</option>
//                                     <option value="الفرع الرابع">الفرع الرابع</option>
//                                     <option value="الفرع الخامس">الفرع الخامس</option>
//                                 </select>
//                                 {errors.familyBranch && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.familyBranch.message}</p>
//                                 )}
//                             </div>

//                             {/* صلة القرابة */}
//                             <div className="space-y-2">
//                                 <label htmlFor="familyRelationship" className="block text-sm font-medium text-gray-700">
//                                     صلة القرابة*
//                                 </label>
//                                 <select
//                                     id="familyRelationship"
//                                     {...register('familyRelationship')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 >
//                                     <option value="">اختر العلاقة</option>
//                                     <option value="زوج">زوج</option>
//                                     <option value="زوجة">زوجة</option>
//                                     <option value="ابن">ابن</option>
//                                     <option value="ابنة">ابنة</option>
//                                     <option value="حفيد">حفيد</option>
//                                 </select>
//                                 {errors.familyRelationship && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.familyRelationship.message}</p>
//                                 )}
//                             </div>

//                             {/* الجنس */}
//                             <div className="space-y-2">
//                                 <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
//                                     الجنس*
//                                 </label>
//                                 <select
//                                     id="gender"
//                                     {...register('gender')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 >
//                                     <option value="">اختر الجنس</option>
//                                     <option value="ذكر">ذكر</option>
//                                     <option value="أنثى">أنثى</option>
//                                 </select>
//                                 {errors.gender && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                                 )}
//                             </div>

//                             {/* الزوج (يظهر فقط للإناث) */}
//                             {gender === 'أنثى' && (
//                                 <div className="space-y-2">
//                                     <label htmlFor="husband" className="block text-sm font-medium text-gray-700">
//                                         الزوج*
//                                     </label>
//                                     <Select
//                                         id="husband"
//                                         options={husbandOptions}
//                                         isLoading={!membersData}
//                                         isDisabled={isUpdating || isCreating || !membersData}
//                                         onChange={(selectedOption) =>
//                                             setValue('husband', selectedOption?.value || '')
//                                         }
//                                         value={selectedHusband}
//                                         className="basic-single"
//                                         classNamePrefix="select"
//                                         placeholder="اختر الزوج"
//                                         noOptionsMessage={() => "لا توجد خيارات متاحة"}
//                                     />
//                                     {errors.husband && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.husband.message}</p>
//                                     )}
//                                 </div>
//                             )}

//                             {/* الزوجات (يظهر فقط للذكور) */}
//                             {gender === 'ذكر' && (
//                                 <div className="space-y-2 md:col-span-2">
//                                     <label htmlFor="wives" className="block text-sm font-medium text-gray-700">
//                                         الزوجات (اختياري - حد أقصى 4)
//                                     </label>
//                                     <Select
//                                         id="wives"
//                                         isMulti
//                                         options={wivesOptions}
//                                         isLoading={!membersData}
//                                         isDisabled={isUpdating || isCreating || !membersData}
//                                         onChange={(selectedOptions) =>
//                                             setValue('wives', selectedOptions?.map(opt => opt.value) || [])
//                                         }
//                                         value={selectedWives}
//                                         className="basic-multi-select"
//                                         classNamePrefix="select"
//                                         placeholder="اختر الزوجات"
//                                         noOptionsMessage={() => "لا توجد خيارات متاحة"}
//                                         isOptionDisabled={() => (wives?.length || 0) >= 4}
//                                     />
//                                     {errors.wives && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.wives.message}</p>
//                                     )}
//                                 </div>
//                             )}


//                             {/* تاريخ الميلاد */}
//                             <div className="space-y-2">
//                                 <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
//                                     تاريخ الميلاد (اختياري)
//                                 </label>
//                                 <input
//                                     id="birthDate"
//                                     type="date"
//                                     {...register('birthDate')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 />
//                             </div>

//                             {/* تاريخ الوفاة */}
//                             <div className="space-y-2">
//                                 <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700">
//                                     تاريخ الوفاة (اختياري)
//                                 </label>
//                                 <input
//                                     id="deathDate"
//                                     type="date"
//                                     {...register('deathDate')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                 />
//                             </div>

//                             {/* ملاحظات */}
//                             <div className="space-y-2 md:col-span-2">
//                                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//                                     ملاحظات (اختياري)
//                                 </label>
//                                 <textarea
//                                     id="notes"
//                                     {...register('notes')}
//                                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     disabled={isUpdating || isCreating}
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>
//                     </>
//                 );
//             }}
//         </BaseForm>
//     );
// };

// export default MemberForm;