export const familyBranches = [
  { value: "الفرع الاول", label: 'الفرع الأول' },
  { value: "الفرع الثاني", label: 'الفرع الثاني' },
  { value: "الفرع الثالث", label: 'الفرع الثالث' },
  { value: "الفرع الرابع", label: 'الفرع الرابع' },
  { value: "الفرع الخامس", label: 'الفرع الخامس' },
];

export const familyRelationships = [
  { value: "ابن", label: 'ابن' },
  { value: "ابنة", label: 'ابنة' },
  { value: "زوجة", label: 'زوجة' },
  { value: "زوج", label: 'زوج' },
  { value: "حفيد", label: 'حفيد' },
  { value: "أخرى", label: 'أخرى' },
];

export const statusOptions = [
  { value: 'مقبول', label: 'مقبول' },
  { value: 'قيد الانتظار', label: 'قيد الانتظار' },
  { value: 'مرفوض', label: 'مرفوض' }
];

export const roleOptions = [
  { value: 'مستخدم', label: 'مستخدم' },
  { value: 'مدير', label: 'مدير' },
  { value: 'مدير عام', label: 'مدير عام' },
  { value: 'مدير النظام', label: 'مدير النظام' },
  { value: 'مدير اللجنه الاجتماعية', label: 'مدير اللجنه الاجتماعية' },
  { value: 'مدير اللجنه الماليه', label: 'مدير اللجنه الماليه' },
  { value: 'كبار الاسرة', label: 'كبار الاسرة' },
];

export const imageUrl = 'https://res.cloudinary.com/dnuxudh3t/image/upload/v1681234567/'

export interface User {
  _id?: string;
  tenantId: string;
  email: string;
  password?: string;  
  phone: string;
  image?: string;
  role: string[];
  familyBranch: 'الفرع الخامس' | 'الفرع الرابع' | 'الفرع الثالث' | 'الفرع الثاني' | 'الفرع الاول';
  familyRelationship: 'ابن' | 'ابنة' | 'زوجة' | 'زوج' | 'حفيد' | 'أخرى';
  status?: 'قيد الانتظار' | 'مرفوض' | 'مقبول';
  address?: string;
  permissions?: any[];
  createdAt?: string;
  updatedAt?: string;
  memberId?: {
    _id: string;
    fname: string;
    lname: string;
    familyBranch: string;
    gender: 'ذكر' | 'أنثى';
    father?: string;
    birthday: Date | string;
    deathDate: Date | string;
    husband?: string;
    wives?: string[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    familyRelationship: string;
  };
  data?: any
}


export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}