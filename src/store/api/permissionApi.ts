import { baseApi } from './baseApi';

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkPermission: builder.mutation({
      query: ({ section, action }) => ({
        url: '/permissions/check',
        method: 'POST',
        body: { section, action },
      }),
    }),
    verifyAction: builder.mutation({
      query: ({ section, action, data }) => ({
        url: `/permissions/verify/${section}/${action}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
  useCheckPermissionMutation, 
  useVerifyActionMutation 
} = permissionApi;