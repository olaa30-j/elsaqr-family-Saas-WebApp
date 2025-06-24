import { baseApi } from './baseApi';
import { clearCredentials, setError } from '../../features/auth/authSlice';
import type { User } from '../../types/user';
import { toast } from 'react-toastify';

/**
 * Authentication API service that extends the base API with auth-specific endpoints.
 * Handles all authentication-related operations including:
 * - User login/logout
 * - Registration
 * - Password management (forgot/reset/change)
 * Integrates with Redux Toolkit Query for efficient data fetching and state management.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login mutation endpoint
     * @param {string} identifier - Username or email
     * @param {string} password - User password
     * @returns {User} - Authenticated user object
     */
    login: builder.mutation<{ user: User }, { identifier: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include', // Includes cookies in the request
      }),
      transformResponse: (response: { user: User }) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          window.location.href = '/dashboard'; // Redirect on success
        } catch (error) {
          dispatch(setError('فشل تسجيل الدخول')); // Arabic: "Login failed"
        }
      },
    }),

    /**
     * Registration mutation endpoint
     * @param {FormData} formData - User registration data (typically includes email, password, etc.)
     * @returns - Registration response
     */
    registration: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Users'], // Invalidates cached user data
    }),

    /**
     * Logout mutation endpoint
     * Clears credentials and redirects to login page
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch }) {
        window.location.href = '/login';
        dispatch(clearCredentials()); // Clear auth state
      },
    }),

    /**
     * Forgot password mutation endpoint
     * @param {string} email - User's registered email
     * @returns {success: boolean, message: string} - Operation status
     */
    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('تم إرسال رابط إعادة التعيين'); // Arabic: "Reset link sent"
        } catch (error) {
          dispatch(setError('فشل إرسال رابط إعادة التعيين')); // Arabic: "Failed to send reset link"
          toast.error('البريد الإلكتروني غير مسجل'); // Arabic: "Email not registered"
        }
      },
    }),

    /**
     * Reset password mutation endpoint
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     * @returns {success: boolean, message: string} - Operation status
     */
    resetPassword: builder.mutation<
      { success: boolean; message: string },
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({        
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { newPassword },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('نجح فى إعادة تعيين كلمة المرور'); // Arabic: "Password reset successful"
          window.location.href = '/login';
        } catch (error) {
          dispatch(setError('فشل إعادة تعيين كلمة المرور')); // Arabic: "Password reset failed"
          toast.error('الرابط غير صالح أو منتهي الصلاحية'); // Arabic: "Invalid or expired link"
        }
      },
    }),

    /**
     * Change password mutation endpoint (for authenticated users)
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {message: string} - Operation result message
     */
    changePassword: builder.mutation<
      { message: string },
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: { oldPassword, newPassword },
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message);
        } catch (error) {
          dispatch(setError('فشل تغيير كلمة المرور: كلمة المرور القديمة غير صحيحة')); // Arabic: "Failed to change password: Old password incorrect"
          toast.error('فشل تغيير كلمة المرور'); // Arabic: "Failed to change password"
        }
      },
    }),
  }),
});

// Auto-generated hooks for each mutation endpoint
export const {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;