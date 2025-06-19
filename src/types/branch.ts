export interface IBranchForm {
  _id?: string;
  name: string;
  show?: boolean;  
  branchOwner?: string; 
}

export interface Branch {
  _id: string;
  name: string;
  branchOwner?: string;
  show: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface CreateBranchRequest {
  name: string;
  branchOwner?: string;
  show?: boolean;
}


export interface UpdateBranchRequest {
  name?: string;
  show?: boolean;
  branchOwner?: string;
}

export interface ToggleVisibilityRequest {
  _id: string;
}

export interface PaginatedBranchesResponse {
  success: boolean;
  data: Branch[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface SingleBranchResponse {
  success: boolean;
  data: Branch;
  message?: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}


export type BranchSortOption = 'name' | 'createdAt' | 'updatedAt';


export interface BranchFilterOptions {
  name?: string;
  isActive?: boolean;
  branchOwner?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetBranchesParams {
  page?: number;
  limit?: number;
  sortBy?: BranchSortOption;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
}

export interface BranchCheckResponse {
  exists: boolean;
  branch?: Branch;
}

export interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  branchesByOwner: Array<{
    ownerId: string;
    ownerName: string;
    count: number;
  }>;
}

export interface BranchOption {
  value: string;
  label: string;
  isActive: boolean;
}