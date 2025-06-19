import type { IBranchForm } from "./branch";
import type { User } from "./user";

export interface AuthCookies {
  accessToken: string;
  adminer_permanent?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message: string;
  cookies?: AuthCookies;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  cookies: {
    accessToken: string | null;
  };
}

export interface RegistrationFormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  familyBranch: IBranchForm;
  familyRelationship: string;
  image?: File;
}


export interface LoginFormData {
  identifier: string;
  password: string;
}


