export const familyBranches = [
  { value: "branch_1", label: 'الفرع الأول' },
  { value: "branch_2", label: 'الفرع الثاني' },
  { value: "branch_3", label: 'الفرع الثالث' },
  { value: "branch_4", label: 'الفرع الرابع' },
  { value: "branch_5", label: 'الفرع الخامس' },
];

export const familyRelationships = [
  { value: "son", label: 'ابن مباشر' },
  { value: "daughter", label: 'ابنة مباشرة' },
  { value: "wife", label: 'زوجة' },
  { value: "husband", label: 'زوج' },
  { value: "grandchild", label: 'حفيد/حفيدة' },
  { value: "other", label: 'أخرى' },
];

export const statusOptions = [
  { value: 'accept', label: 'مفعل' },
  { value: 'pending', label: "معلق" }
];

export const roleOptions = [
  { value: 'user', label: 'عضو' },
  { value: 'admin', label: 'مدير' },
  { value: 'super_admin', label: 'مدير عام' },
];

export const imageUrl = 'https://res.cloudinary.com/dnuxudh3t/image/upload/v1681234567/'

export interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  phone: string;
  image?: string;
  role?: string;
  familyBranch: string;
  familyRelationship: string;
  status?: string;
  address: string;
  birthday: Date;
  personalProfile?: string;
  permissions: any;
  createdAt?: string;
  updatedAt?: string;
  data?: any
}


export interface IUpdateUserDTO {
  status: string;
  role: string;
  birthday: Date | null;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  familyBranch: string;
  familyRelationship: string;
  address: string;
  permissions?: any;
  image?: File | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}