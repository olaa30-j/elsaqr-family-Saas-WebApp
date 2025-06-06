export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';
export type PermissionSection = 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';

export type Permission = {
  [key in PermissionAction]: boolean;
};

export type UserPermissions = {
  [section in PermissionSection]?: Permission;
};

export interface IPermission {
  entity: 'مناسبه' | 'عضو' | 'مستخدم' | 'معرض الصور' | 'ماليه' | 'اعلان';
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'مدير النظام' | 'مدير اللجنه الاجتماعية' | 'مدير اللجنه الماليه';
  permissions: UserPermissions;
}

export const isPermissionSection = (value: string): value is PermissionSection => {
  return ['مناسبه', 'عضو', 'مستخدم', 'معرض الصور', 'ماليه', 'اعلان'].includes(value);
};

export const isPermissionAction = (value: string): value is PermissionAction => {
  return ['view', 'create', 'edit', 'delete', 'manage'].includes(value);
};
 