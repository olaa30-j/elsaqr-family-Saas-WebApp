import * as yup from 'yup';

export const userSchema = yup.object().shape({
    email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    phone: yup.string().required('رقم الهاتف مطلوب'),
    familyBranch: yup.string().optional(), 
    familyRelationship: yup.string().optional(),  
    address: yup.string().optional(),
    role: yup.string().optional(),  
    status: yup.string().optional(),
    password: yup
        .string()
        .optional()
        .min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
});

export const profileSchema = yup.object().shape({
    email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    phone: yup.string()
        .required('رقم الهاتف مطلوب')
        .matches(/^5\d{8}$/, 'يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5').required(),
    address: yup.string().optional(),
});


export const memberSchema = yup.object().shape({
    _id: yup.string().optional(),

    fname: yup
        .string()
        .min(2, 'الاسم الأول يجب أن يكون على الأقل حرفين')
        .max(50, 'الاسم الأول لا يمكن أن يتجاوز 50 حرفًا')
        .required('الاسم الأول مطلوب'),

    lname: yup
        .string()
        .min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين')
        .max(50, 'الاسم الأخير لا يمكن أن يتجاوز 50 حرفًا')
        .required('الاسم الأخير مطلوب'),

    familyBranch: yup
        .string()
        .required('يجب اختيار الفرع العائلي'),

    familyRelationship: yup
        .string()
        .oneOf(["ابن", "ابنة", "زوجة", "زوج", "حفيد", "أخرى"], 'صلة القرابة غير صالحة')
        .required('صلة القرابة مطلوبة'),

    gender: yup
        .string()
        .oneOf(['ذكر', 'أنثى'], 'الجنس يجب أن يكون "ذكر" أو "أنثى"')
        .required('يجب اختيار الجنس'),

    // husband: yup
    //     .string()
    //     .nullable()
    //     .optional() 
    //     .when(['gender', 'familyRelationship'], {
    //         is: (gender: string, relationship: string) =>
    //             gender === 'أنثى' && relationship === 'زوجة',
    //         then: (schema) => schema.required('يجب تحديد الزوج للزوجة'),
    //         otherwise: (schema) => schema.nullable().optional()
    //     }),

    // wives: yup
    //     .array()
    //     .default([])  
    //     .of(yup.string())
    //     .max(4, 'لا يمكن للذكر أن يكون له أكثر من 4 زوجات'),

    birthday: yup
        .date()
        .nullable()
        .max(new Date(), 'تاريخ الميلاد لا يمكن أن يكون في المستقبل')
        .typeError('يجب أن يكون تاريخًا صالحًا'),

    deathDate: yup
        .mixed()
        .nullable()
        .test(
            'is-valid-date',
            'يجب أن يكون تاريخًا صالحًا',
            (value) => !value || (value instanceof Date && !isNaN(value.getTime()))
        )
        .test(
            'death-after-birth',
            'تاريخ الوفاة لا يمكن أن يكون قبل تاريخ الميلاد',
            function (value) {
                const { birthday } = this.parent;
                if (!value) return true;
                return !birthday || value >= birthday;
            }
        ),

    summary: yup.string().max(500, 'الملخص لا يمكن أن يتجاوز 500 حرف').optional(),

    image: yup
        .mixed()
        .optional()
});

export type UserFormValues = yup.InferType<typeof userSchema>;
export type ProfileFormValues = yup.InferType<typeof profileSchema>;
export type MemberFormValues = yup.InferType<typeof memberSchema>;
