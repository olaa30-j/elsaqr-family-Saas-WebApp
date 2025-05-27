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

export interface User {
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
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface CreateMemberDto {
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  password?: string;
  familyBranch?: string;
  familyRelationship?: string;
  role: string;
  status: string;
  permissions?: string[];
  image?: File;
}