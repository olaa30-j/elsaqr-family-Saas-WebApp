import { baseApi } from './baseApi';
import { clearCredentials, setError } from '../../features/auth/authSlice';
import type { User } from '../../types/user';
import { toast } from 'react-toastify';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User }, { identifier: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      transformResponse: (response: { user: User }) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          let data = await queryFulfilled;
          console.log(data);
          window.location.href = '/dashboard';
        } catch (error) {
          dispatch(setError('فشل تسجيل الدخول'));
        }
      },
    }),

    registration: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
      invalidatesTags: ['Users'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch }) {
        window.location.href = '/login';
        dispatch(clearCredentials());
      },
    }),

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
          const { data } = await queryFulfilled;
          toast.success(data.message);
        } catch (error) {
          dispatch(setError('فشل إرسال رابط إعادة التعيين'));
          toast.error('البريد الإلكتروني غير مسجل');
        }
      },
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'PATCH',
        body: { newPassword },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message);
          window.location.href = '/login';
        } catch (error) {
          dispatch(setError('فشل إعادة تعيين كلمة المرور'));
          toast.error('الرابط غير صالح أو منتهي الصلاحية');
        }
      },
    }),

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
          dispatch(setError('فشل تغيير كلمة المرور: كلمة المرور القديمة غير صحيحة'));
          toast.error('فشل تغيير كلمة المرور');
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;