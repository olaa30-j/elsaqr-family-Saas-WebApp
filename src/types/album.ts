export interface Image {
  image: any;
  _id: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Album {
  image?: string;
  data?: any;
  _id: string;
  name: string;
  description?: string;
  images: Image[];  
  createdBy: {  
    _id: string;
    fname: string;
    lname: string;
    email?: string;
    image?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Request DTOs
export interface CreateAlbumDTO {
  name: string;
  description?: string;
}

export interface UpdateAlbumDTO {
  name?: string;
  description?: string;
}

export interface AddImageDTO {
  image: File;
  description?: string;
}

// Response Types
export interface AlbumResponse {
  success?: boolean;
  data: Album;
  message?: string;
}

export interface AlbumsResponse {
  success: boolean;
  data: Album[];
  pagination: Pagination;
  message?: string;
}

export interface AlbumImageResponse {
  success: boolean;
  data: Image;
  message?: string;
}