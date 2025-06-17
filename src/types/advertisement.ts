export interface IAdvertisement {
  data?: any;
  status: AdvertisementStatus;
  _id: string;
  userId:UserId;
  title: string;
  type: AdvertisementType;
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
  role: string[]; 
  status: 'مقبول' | 'معلق' | 'مرفوض'; 
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

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
  status: string;
}

export interface Pagination {
  totalAdvertisements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export type AdvertisementType = 'general' | 'important' | 'social';
export type AdvertisementStatus = 'pending' | 'reject' | 'accept';
