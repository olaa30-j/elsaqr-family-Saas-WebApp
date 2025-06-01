// types/advertisement.ts
export interface IAdvertisement {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  address: string;
  type: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// types/common.ts
export interface Pagination {
  totalAdvertisements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}