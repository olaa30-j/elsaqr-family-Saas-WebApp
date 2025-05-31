export interface Image {
  _id: string;
  url: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Album {
  data?: Album;
  _id: string;
  name: string;
  description?: string;
  images: Image[] | string[];  
  createdBy: {  
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
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