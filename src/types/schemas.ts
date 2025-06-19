import * as yup from 'yup';

export const userSchema = yup.object().shape({
    email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    phone: yup.string().required('رقم الهاتف مطلوب'),
    familyBranch: yup.string().optional(),
    familyRelationship: yup
        .string()
        .oneOf(
            ["ابن", "ابنة", "زوجة", "زوج", "حفيد", "حفيدة", "أخرى", "الجد الأعلى"],
            "صلة القرابة غير صالحة"
        )
        .required('صلة القرابة مطلوبة'),
    address: yup.string().optional(),
    role: yup.string().optional(),
    status: yup.string().optional(),
    password: yup
        .string()
        .optional()
        .min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
});

export const branchSchema = yup.object().shape({
    name: yup.string().required('اسم الفرع مطلوب'),
    branchOwner: yup.string().required('مدير الفرع مطلوب'),
    show: yup.boolean().required('حالة الظهور مطلوبة'),
});


export const profileSchema = yup.object().shape({
    email: yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    phone: yup.string().required('رقم الهاتف مطلوب'),
    address: yup.string().required('العنوان مطلوب'),
});



export const memberSchema = yup.object().shape({
    _id: yup.string().optional(),

    fname: yup
        .string()
        .trim()
        .min(2, 'الاسم الاول يجب أن يكون على الأقل حرفين')
        .max(50, 'الاسم الاول لا يمكن أن يتجاوز 50 حرفًا')
        .matches(/^[\u0600-\u06FF\s]+$/, 'يجب أن يحتوي الاسم الاول على أحرف عربية فقط')
        .required('الاسم الاول مطلوب'),

    lname: yup
        .string()
        .trim()
        .min(10, 'اسم الاب واسم الجد يجب أن يكون على الأقل 10 حروف')
        .max(50, 'اسم الاب واسم الجد لا يمكن أن يتجاوز 50 حرفًا')
        .matches(/^[\u0600-\u06FF\s]+$/, 'يجب أن يحتوي اسم الاب واسم الجد على أحرف عربية فقط')
        .required('اسم الاب و اسم الجد مطلوب'),

    familyBranch: yup
        .string()
        .required('يجب اختيار الفرع العائلي'),

    familyRelationship: yup
        .string()
        .oneOf(
            ["ابن", "ابنة", "زوجة", "زوج", "حفيد", "حفيدة", "أخرى", "الجد الأعلى"],
            "صلة القرابة غير صالحة"
        )
        .required('صلة القرابة مطلوبة'),

    gender: yup
        .string()
        .oneOf(['ذكر', 'أنثى'], 'الجنس يجب أن يكون "ذكر" أو "أنثى"')
        .required('يجب اختيار الجنس'),

    husband: yup
        .mixed<string | { _id: string }>()
        .optional()
        .nullable()
        .test(
            'husband-type',
            'يجب أن يكون الزوج معرفًا صالحًا',
            function (value) {
                if (value === null || value === undefined || value === '') return true;

                if (typeof value === 'string') return true;
                if (typeof value === 'object' && '_id' in value) return true;

                return false;
            }
        )
        .test(
            'husband-required',
            'يجب تحديد الزوج للزوجة',
            function (value) {
                const { gender, familyRelationship } = this.parent;
                if (gender === 'أنثى' && familyRelationship === 'زوجة') {
                    return !!value;
                }
                return true;
            }
        ),

    wives: yup
        .array()
        .of(yup.mixed<string | { _id: string }>())
        .optional()
        .test(
            'wives-limit',
            'لا يمكن للذكر أن يكون له أكثر من 4 زوجات',
            function (value) {
                const { gender } = this.parent;
                if (gender === 'ذكر' && value && value.length > 4) {
                    return false;
                }
                return true;
            }
        ),

    children: yup
        .array()
        .of(yup.mixed<string | { _id: string; birthday?: Date | string }>())
        .optional()
        .test(
            'children-age',
            'يجب أن يكون تاريخ ميلاد الأبناء بعد تاريخ ميلاد العضو',
            function (value) {
                if (!value || !this.parent.birthday) return true;

                const parentBirthday = new Date(this.parent.birthday);
                return value.every(child => {
                    if (typeof child === 'object' && 'birthday' in child && child.birthday) {
                        const childBirthday = new Date(child.birthday);
                        return childBirthday > parentBirthday;
                    }
                    return true;
                });
            }
        ),

    birthday: yup
        .mixed()
        .nullable()
        .test(
            'not-future',
            'تاريخ الميلاد لا يمكن أن يكون في المستقبل',
            (value: any) => {
                if (!value) return true;
                const date = new Date(value);
                return date <= new Date();
            }
        )
        .typeError('يجب إدخال تاريخ ميلاد صالح'),


    deathDate: yup
        .mixed()
        .nullable()
        .transform((value, originalValue) => {
            if (!originalValue || originalValue === '') return null;

            if (value instanceof Date && !isNaN(value.getTime())) {
                return value;
            }

            if (typeof originalValue === 'string') {
                const date = new Date(originalValue);
                return isNaN(date.getTime()) ? null : date;
            }

            return null;
        })
        .optional(),

    summary: yup
        .string()
        .optional()
        .max(500, 'الملخص لا يمكن أن يتجاوز 500 حرف')
        .nullable(),

    image: yup
        .mixed()
        .nullable(),

    parents: yup
        .object()
        .shape({
            father: yup.mixed<string | { _id: string }>().optional().nullable(),
            mother: yup.mixed<string | { _id: string }>().optional().nullable()
        })
        .optional()
        .nullable()
        .test(
            'not-self-parent',
            'لا يمكن للعضو أن يكون والد نفسه',
            function (value) {
                const { _id } = this.parent;
                if (!value || !_id) return true;

                const fatherId = typeof value.father === 'object' ? value.father?._id : value.father;
                const motherId = typeof value.mother === 'object' ? value.mother?._id : value.mother;

                return (fatherId !== _id && motherId !== _id);
            }
        )
});

export type UserFormValues = yup.InferType<typeof userSchema>;
export type ProfileFormValues = yup.InferType<typeof profileSchema>;
export type BranchFormValues = yup.InferType<typeof branchSchema>;
export type MemberFormValues = yup.InferType<typeof memberSchema>;
