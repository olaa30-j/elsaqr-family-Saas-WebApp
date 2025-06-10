import { baseApi } from './baseApi';
import {
  type User,
  checkUserPermission,
  isPermissionEntity,
  isPermissionAction,
  type PermissionEntity,
  type PermissionAction
} from "../../types/permissionsStructure";
interface PermissionUpdateArgs {
  role: string;
  entity: string;
  action: 'view' | 'create' | 'update' | 'delete';
  value: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPermissions: builder.query<{
      data: Array<{
        _id: string;
        role: string;
        permissions: Array<{
          entity: string;
          view: boolean;
          create: boolean;
          update: boolean;
          delete: boolean;
        }>;
        createdAt: string;
        updatedAt: string;
      }>, total: number
    }, { page: number, limit: number }>({
      query: ({ page = 1, limit = 10 }) => `/permission?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => response,
    }),

    updatePermissionForRole: builder.mutation<ApiResponse, PermissionUpdateArgs>({
      query: ({ role, ...body }) => ({
        url: `/permission/${role}`,
        method: 'PATCH',
        body,
        credentials: 'include'
      }),
      transformErrorResponse: (response: any) => {
        return {
          success: false,
          message: response.data?.message || 'Failed to update permission'
        };
      },
    }),

    checkPermission: builder.mutation<{
      success: boolean;
      hasPermission: boolean;
      message: string;
    }, {
      entity: PermissionEntity;
      action: PermissionAction;
      role?: string;
    }>({
      query: ({ entity, action }) => {
        return {
          url: '/permission/check',
          method: 'POST',
          body: { entity, action },
        };
      },
      transformResponse: (baseResponse: any, _, { entity, action }) => {
        if (!isPermissionEntity(entity)) {
          console.error(`Invalid entity: ${entity}`);
          return {
            success: false,
            hasPermission: false,
            message: `Invalid entity: ${entity}`
          };
        }

        if (!isPermissionAction(action)) {
          console.error(`Invalid action: ${action}`);
          return {
            success: false,
            hasPermission: false,
            message: `Invalid action: ${action}`
          };
        }

        return {
          success: true,
          hasPermission: baseResponse?.hasPermission || false,
          message: baseResponse?.message || ''
        };
      },
      transformErrorResponse: (response: any) => {
        console.error('[Permission API] Error:', response);
        return {
          success: false,
          hasPermission: false,
          message: response.data?.message || 'Permission check failed'
        };
      },
    }),
  }),
});

export const hasPermission = (
  user: User | null,
  entity: PermissionEntity,
  action: PermissionAction,
): boolean => {
  if (!user) return false;

  if (user.role.includes('مدير النظام')) return true;

  if (!isPermissionEntity(entity) || !isPermissionAction(action)) {
    console.error(`Invalid permission check: ${entity}.${action}`);
    return false;
  }

  return checkUserPermission(user, entity, action);
};

export const checkRoutePermissions = (
  user: User | null,
  requiredPermissions: { entity: PermissionEntity; action: PermissionAction }[] = []
): boolean => {
  if (!requiredPermissions.length) return true;
  if (!user) return false;

  return requiredPermissions.every(({ entity, action }) =>
    hasPermission(user, entity, action)
  );
};

export const {
  useUpdatePermissionForRoleMutation,
  useCheckPermissionMutation,
  useGetAllPermissionsQuery
} = permissionApi;