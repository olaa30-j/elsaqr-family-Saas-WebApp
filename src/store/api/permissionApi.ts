import { baseApi } from './baseApi';
import {
  type User,
  checkUserPermission,
  isPermissionEntity,
  isPermissionAction,
  type PermissionEntity,
  type PermissionAction
} from "../../types/permissionsStructure";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkPermission: builder.mutation<{
      success: boolean;
      hasPermission: boolean;
      message: string;
    }, {
      entity: PermissionEntity;
      action: PermissionAction;
    }>({
      query: ({ entity, action }) => {
        console.log('[Permission API] Request:', { entity, action });
        return {
          url: '/permission',
          method: 'POST',
          body: { entity, action },
        };
      },
      transformResponse: (baseResponse: any, _, { entity, action }) => {
        console.log('[Permission API] Response:', baseResponse);

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

        // Transform the server response to match our expected format
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
  action: PermissionAction
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
  useCheckPermissionMutation
} = permissionApi;