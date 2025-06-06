// types/advertisement.ts
export interface IAdvertisement {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  title: string;
  type: string;
  content: string;
  image?: string;  
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