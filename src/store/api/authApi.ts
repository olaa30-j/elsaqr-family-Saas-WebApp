import { baseApi } from './baseApi';
import { clearCredentials, setError } from '../../features/auth/authSlice';
import type { User} from '../../types/user';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User }, { identifier: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include'
      }),
      transformResponse: (response: { user: User }) => response,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          window.location.href = '/dashboard'
        } catch (error) {
          dispatch(setError('فشل تسجيل الدخول'));
        }
      }
    }),
    registration: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
        credentials: 'include'
      }),
      invalidatesTags: ['Users'],  
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include'
      }),
      async onQueryStarted(_, { dispatch }) {
          window.location.href = '/login'
        dispatch(clearCredentials());
      }
    })
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,  
  useLogoutMutation,
} = authApi;