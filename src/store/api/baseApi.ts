import { createApi, fetchBaseQuery, type BaseQueryApi, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials } from '../../features/auth/authSlice';
import type { User } from '../../types/user';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD
    ? 'https://saas88.vercel.app/api/v1'
    : '/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('x-vercel-project-id', 'prj_97LW8EmfCk8W5hXRxWTpOhLjV6Zw');
    return headers;
  },
});

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("unautheraized");  
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Members', 'Users', 'Transaction'],
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
          const { data } = await queryFulfilled;          
          dispatch(setCredentials({ user: data.data }));
      }
    }),
  }),
});

export const { useGetAuthUserQuery } = baseApi;