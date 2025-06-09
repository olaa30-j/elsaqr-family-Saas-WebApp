// import {type PermissionEntity, type PermissionAction } from "../types/permissionsStructure";


export const verifyActionPermission = async (
  entity: PermissionEntity,
  action: PermissionAction,
  data?: any
) => {
  try {
    const response = await fetch('/api/permissions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entity, action, data }),
    });
    
    if (!response.ok) {
      throw new Error('Permission denied');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
export type PermissionEntity = 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

type PermissionPoint = {
  entity: PermissionEntity;
  action: PermissionAction;
  requireServerCheck?: boolean;
};

export const PERMISSION_POINTS = {
  // // لوحة التحكم
  // DASHBOARD_VIEW: {
  //   entity: 'لوحة_التحكم',
  //   action: 'view',
  // },

  // مناسبه
  EVENT_VIEW: {
    entity: 'مناسبه',
    action: 'view',
  },
  EVENT_EDIT: {
    entity: 'مناسبه',
    action: 'update',
  },
  EVENT_DELETE: {
    entity: 'مناسبه',
    action: 'delete',
  },
  EVENT_CREATE: {
    entity: 'مناسبه',
    action: 'create',
  },

  // عضو
  MEMBER_VIEW: {
    entity: 'عضو',
    action: 'view',
  },
  MEMBER_EDIT: {
    entity: 'عضو',
    action: 'update',
  },
  MEMBER_DELETE: {
    entity: 'عضو',
    action: 'delete',
  },
  MEMBER_CREATE: {
    entity: 'عضو',
    action: 'create',
  },

  // مستخدم
  USER_VIEW: {
    entity: 'مستخدم',
    action: 'view',
  },
  USER_EDIT: {
    entity: 'مستخدم',
    action: 'update',
  },
  USER_DELETE: {
    entity: 'مستخدم',
    action: 'delete',
    requireServerCheck: true,
  },
  USER_CREATE: {
    entity: 'مستخدم',
    action: 'create',
  },

  GALLERY_VIEW: {
    entity: 'معرض الصور',
    action: 'view',
  },
  GALLERY_EDIT: {
    entity: 'معرض الصور',
    action: 'update',
  },
  GALLERY_DELETE: {
    entity: 'معرض الصور',
    action: 'delete',
  },
  GALLERY_CREATE: {
    entity: 'معرض الصور',
    action: 'create',
  },

  // ماليه
  FINANCIAL_VIEW: {
    entity: 'ماليه',
    action: 'view',
    requireServerCheck: true,
  },
  FINANCIAL_EDIT: {
    entity: 'ماليه',
    action: 'update',
  },
  FINANCIAL_DELETE: {
    entity: 'ماليه',
    action: 'delete',
  },
  FINANCIAL_CREATE: {
    entity: 'ماليه',
    action: 'create',
  },

  // اعلان
  AD_VIEW: {
    entity: 'اعلان',
    action: 'view',
  },
  AD_EDIT: {
    entity: 'اعلان',
    action: 'update',
  },
  AD_DELETE: {
    entity: 'اعلان',
    action: 'delete',
  },
  AD_CREATE: {
    entity: 'اعلان',
    action: 'create',
  },
} satisfies Record<string, PermissionPoint>;
