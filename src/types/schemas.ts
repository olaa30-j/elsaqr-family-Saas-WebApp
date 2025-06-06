import * as yup from 'yup';

export const userSchema = yup.object().shape({
    email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    phone: yup.string()
        .required('رقم الهاتف مطلوب')
        .matches(/^5\d{8}$/, 'يجب أن يتكون رقم الهاتف من 9 أرقام ويبدأ بـ 5').required(),
    familyBranch: yup.string().required('فرع العائلة مطلوب'),
    familyRelationship: yup.string().required('صلة القرابة مطلوبة'),
    address: yup.string().optional(),
    role: yup.string().required('الدور مطلوب'),
    status: yup.string().optional(),
    password: yup
        .string()
        .optional()
        .min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
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

    father: yup
        .string()
        .nullable()
        .optional(),

    husband: yup
        .string()
        .nullable()
        .when(['gender', 'familyRelationship'], {
            is: (gender: string, relationship: string) =>
                gender === 'أنثى' && relationship === 'زوجة',
            then: (schema) => schema.required('يجب تحديد الزوج للزوجة'),
            otherwise: (schema) => schema.optional().nullable()
        }),

    wives: yup
        .array()
        .of(yup.string().required('يجب تحديد ID الزوجة'))
        .when(['gender', 'familyRelationship'], {
            is: (gender: string, relationship: string) =>
                gender === 'ذكر' && relationship === 'زوج',
            then: (schema) => schema.max(4, 'لا يمكن للذكر أن يكون له أكثر من 4 زوجات'),
            otherwise: (schema) => schema.optional().nullable()
        }),

    image: yup
        .mixed()
        .test(
            'is-valid-image',
            'يجب أن تكون الصورة ملفًا صالحًا أو رابط URL',
            (value) => {
                if (!value) return true;
                if (typeof value === 'string') return true;
                if (value instanceof File) return true;
                return false;
            }
        )
        .optional()
        .nullable(),
    birthDate: yup
        .date()
        .nullable()
        .optional()
        .max(new Date(), 'تاريخ الميلاد لا يمكن أن يكون في المستقبل'),

    deathDate: yup
        .date()
        .nullable()
        .optional()
        .min(
            yup.ref('birthDate'),
            'تاريخ الوفاة لا يمكن أن يكون قبل تاريخ الميلاد'
        ),

    notes: yup
        .string()
        .nullable()
        .optional()
        .max(500, 'الملاحظات لا يمكن أن تتجاوز 500 حرف')
});

export type UserFormValues = yup.InferType<typeof userSchema>;
export type MemberFormValues = yup.InferType<typeof memberSchema>;
