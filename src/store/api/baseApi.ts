import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials } from '../../features/auth/authSlice';
import type { User } from '../../types/user';

const baseQuery = fetchBaseQuery({
baseUrl: import.meta.env.PROD
    ? 'https://saas3-mocha.vercel.app/api/v1'
    : '/api/v1',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('x-vercel-project-id', 'prj_cFdrW8o9HEbJ8ARkZMxH0wlEjlzy');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (typeof args.url === 'string' &&
    !args.url.includes('login') &&
    !args.url.includes('register')) {
    if (result.error?.status === 401) {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Members', 'Users'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAuthUser: builder.query<User, void>({
      query: () => ({
        url: 'user/authUser',
        method: 'POST',
        credentials: 'include'
      }),
      providesTags: ['Users'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data }));
        } catch (error) {
          dispatch(clearCredentials());
        }
      }
    }),
  }),
});

export const useGetAuthUserQuery: typeof baseApi.useGetAuthUserQuery = baseApi.useGetAuthUserQuery;
