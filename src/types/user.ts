import type { Permission } from "./permissionsStructure";


export const familyRelationships = [
  { value: "ابن", label: "ابن" },
  { value: "ابنة", label: "ابنة" },
  { value: "زوجة", label: "زوجة" },
  { value: "زوج", label: "زوج" },
  { value: "أخرى", label: "أخرى" },
  { value: "الجد الأعلى", label: "الجد الأعلى" }, 
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
  status?: 'قيد الانتظار' | 'مرفوض' | 'مقبول';
  address?: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
  memberId: {
    _id: string;
    fname: string;
    lname: string;
    familyBranch: any;
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
  totalUsers: number,
  totalPages: number,
  currentPage: number,
  pageSize: number,
}