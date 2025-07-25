import type { IBranchForm } from "./branch";

export type PermissionEntity = 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';
export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export type Permission = {
  entity: PermissionEntity;
  actions: {
    [key in PermissionAction]?: boolean;
  };
};

export type UserRole = 'مدير النظام' | 'مدير اللجنه الاجتماعية' | 'مدير اللجنه الماليه';

export interface User {
  _id?: string;
  tenantId: string;
  email: string;
  password?: string;
  phone: string;
  image?: string;
  role: string[];
  permissions: Permission[];
  status?: 'قيد الانتظار' | 'مرفوض' | 'مقبول';
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  memberId: {
    _id: string;
    fname: string;
    lname: string;
    familyBranch: IBranchForm;
    gender: 'ذكر' | 'أنثى';
    father?: string;
    birthday: Date | string;
    deathDate: Date | string;
    husband?: string;
    wives?: string[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    familyRelationship: string;
  };
}

// تحقق من أنواع الصلاحيات
export const isPermissionEntity = (value: string): value is PermissionEntity => {
  return ['مناسبه', 'عضو', 'مستخدم', 'معرض الصور', 'ماليه', 'اعلان'].includes(value);
};

export const isPermissionAction = (value: string): value is PermissionAction => {
  return ['view', 'create', 'update', 'delete'].includes(value);
};

export const isUserRole = (value: string): value is UserRole => {
  return ['مدير النظام', 'مدير اللجنه الاجتماعية', 'مدير اللجنه الماليه'].includes(value);
};


export const checkUserPermission = (user: User, entity: PermissionEntity, action: PermissionAction): boolean => {
  if (!user?.permissions) return false;

  const entityPermission = user.permissions.find(p => p.entity === entity);
  if (!entityPermission?.actions) return false;

  return entityPermission.actions[action] === true;
};


export const hasPermission = (user: User | null, entity: PermissionEntity, action: PermissionAction): boolean => {
  if (!user) return false;
  
  if (user.role.some(role => role === 'مدير النظام')) return true;

  return checkUserPermission(user, entity, action);
};

export const checkRoutePermissions = (
  user: User | null,
  requiredPermissions: { entity: PermissionEntity; action: PermissionAction }[]
): boolean => {
  if (!user) return false;

  if (user.role.includes('مدير النظام')) return true;

  return requiredPermissions.every(({ entity, action }) =>
    checkUserPermission(user, entity, action)
  );
};
