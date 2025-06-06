// import React from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import InputField from '../../../ui/InputField';
// import SelectField from '../../../ui/SelectField';
// import DatePickerField from '../../../ui/DatePickerField';
// import PhoneInput from '../../../ui/PhoneInput';
// import { familyBranches, familyRelationships } from '../../../../types/user';
// import { useAppDispatch, useAppSelector } from '../../../../store/store';
// import { toast } from 'react-toastify';
// import { useUpdateUserMutation } from '../../../../store/api/usersApi';
// import { setCredentials } from '../../../../features/auth/authSlice';

// export interface ProfileFormData {
//     fname: string;
//     lname: string;
//     email: string;
//     phone: string;
//     familyBranch: string;
//     familyRelationship: string;
//     address: string;
//     birthday: Date | null;
// }

// const profileSchema = yup.object().shape({
//     fname: yup.string().required('الاسم الأول مطلوب'),
//     lname: yup.string().required('الاسم الأخير مطلوب'),
//     email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
//     phone: yup.string()
//         .required('رقم الهاتف مطلوب')
//         .matches(/^5\d{8}$/, 'يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5'),
//     familyBranch: yup.string().required('فرع العائلة مطلوب'),
//     familyRelationship: yup.string().required('صلة القرابة مطلوبة'),
//     address: yup.string().required('العنوان مطلوب'),
//     birthday: yup.date().required('تاريخ الميلاد مطلوب').nullable(),
// });

// interface ProfileFormProps {
//     isEditing: boolean;
//     onCancel: () => void;
// }

// const ProfileForm: React.FC<ProfileFormProps> = ({
//     isEditing,
//     onCancel
// }) => {
//     const user = useAppSelector((state) => state.auth.user);
//     const dispatch = useAppDispatch();

//     const [updateUser] = useUpdateUserMutation();

//     const {
//         control,
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<ProfileFormData>({
//         resolver: yupResolver(profileSchema),
//         defaultValues: {
//             email: user?.email || '',
//             phone: user?.phone || '',
//             familyBranch: user?.familyBranch || '',
//             familyRelationship: user?.familyRelationship || '',
//             address: user?.address || '',
//         },
//     });

//     const handleFormSubmit: SubmitHandler<ProfileFormData> = async (data) => {
//         const formData = new FormData();

//         Object.entries(data).forEach(([key, value]) => {
//             if (value !== undefined && value !== null) {
//                 if (value instanceof Date) {
//                     formData.append(key, value.toISOString());
//                 } else {
//                     formData.append(key, value.toString());
//                 }
//             }
//         });

//         if (user) {
//             try {
//                 const response = await updateUser({ id: user._id, formData }).unwrap();
//                 toast.success("تم تعديل البيانات بنجاح");
//                 dispatch(setCredentials({ user: response.data }));
//                 onCancel()

//             } catch (error) {
//                 toast.error("تأكد من صحة البيانات و راجع المحاولة");
//                 console.log(error);
//             }
//         }
//     };
//     return (
//         <form onSubmit={handleSubmit(handleFormSubmit)}>
//             <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//                 <div className="flex flex-col space-y-1.5 p-6">
//                     <div className="text-2xl font-semibold leading-none tracking-tight">
//                         المعلومات الشخصية
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         إدارة معلوماتك الشخصية والتفضيلات
//                     </div>
//                 </div>

//                 <div className="p-6 pt-0 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <InputField
//                             label="الاسم الأول"
//                             id="fname"
//                             type="text"
//                             register={register}
//                             error={errors.fname}
//                             disabled={!isEditing}
//                             name="fname"
//                             required
//                         />

//                         <InputField
//                             label="الاسم الأخير"
//                             id="lname"
//                             type="text"
//                             register={register}
//                             error={errors.lname}
//                             disabled={!isEditing}
//                             name="lname"
//                             required
//                         />

//                         <InputField
//                             label="البريد الإلكتروني"
//                             id="email"
//                             type="email"
//                             register={register}
//                             error={errors.email}
//                             disabled={!isEditing}
//                             name="email"
//                             required
//                         />

//                         <PhoneInput
//                             label="رقم الهاتف"
//                             name="phone"
//                             id="phone"
//                             register={register}
//                             error={errors.phone}
//                             disabled={!isEditing}
//                             required
//                             control={control}
//                             description="يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5"
//                         />

//                         <SelectField
//                             label="فرع العائلة"
//                             name="familyBranch"
//                             id="familyBranch"
//                             options={familyBranches}
//                             register={register}
//                             disabled={!isEditing}
//                             error={errors.familyBranch}
//                             required
//                             control={control}
//                         />

//                         <SelectField
//                             label="صلة القرابة بالعائلة"
//                             name="familyRelationship"
//                             id="familyRelationship"
//                             options={familyRelationships}
//                             register={register}
//                             disabled={!isEditing}
//                             control={control}
//                             error={errors.familyRelationship}
//                             required
//                         />

//                         <div className='w-full'>
//                             <InputField
//                                 label="العنوان"
//                                 id="address"
//                                 type="text"
//                                 register={register}
//                                 error={errors.address}
//                                 disabled={!isEditing}
//                                 name="address"
//                             />

//                         </div>

//                         <DatePickerField
//                             label="تاريخ الميلاد"
//                             id="birthday"
//                             control={control}
//                             error={errors.birthday}
//                             disabled={!isEditing}
//                             name="birthday"
//                             maxDateToday
//                         />

//                     </div>
//                 </div>

//                 {isEditing && (
//                     <div className="flex items-center justify-end gap-2 p-6 pt-0">
//                         <button
//                             type="button"
//                             onClick={onCancel}
//                             className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
//                         >
//                             إلغاء
//                         </button>
//                         <button
//                             type="submit"
//                             className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2"
//                         >
//                             حفظ التغييرات
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </form>
//     );
// };

// export default ProfileForm;