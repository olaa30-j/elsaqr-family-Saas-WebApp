export interface IAdvertisement {
  _id: string;
  userId:UserId;
  title: string;
  type: string;
  content: string;
  image?: string;  
  createdAt: string;
  updatedAt: string;
}

export interface UserId {
  _id?: string;
  fname: string;
  lname: string;
  email: string;
  phone: number;
  address: string;
  birthday: string;
  image: string;
  familyBranch: string;
  familyRelationship: string;
  role: string[]; 
  status: 'مقبول' | 'معلق' | 'مرفوض'; 
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// types/advertisement.ts
export interface AdvertisementQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface IAdvertisementForm {
  title: string;
  type: string;
  content: string;
  image?: File | null;  
}

// types/common.ts
export interface Pagination {
  totalAdvertisements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}