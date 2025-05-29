export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';
export type PermissionSection = 'dashboard' | 'family' | 'financial' | 'members' | 'announcements' | 'events' | 'documents' | 'admin';

export type Permission = {
  [key in PermissionAction]: boolean;
};

export type UserPermissions = {
  [section in PermissionSection]?: Permission;
};

export interface IPermission {
  entity: 'event' | 'member' | 'user' | 'album' | 'financial';
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: UserPermissions;
}

export const isPermissionSection = (value: string): value is PermissionSection => {
  return ['dashboard', 'family', 'financial', 'members', 'announcements', 'events', 'documents', 'admin'].includes(value);
};

export const isPermissionAction = (value: string): value is PermissionAction => {
  return ['view', 'create', 'edit', 'delete', 'manage'].includes(value);
};
 

// export type PermissionAction = 'عرض' | 'إنشاء' | 'تعديل' | 'حذف' | 'إدارة';
// export type PermissionSection = 'لوحة التحكم' | 'العائلة' | 'المالية' | 'الأعضاء' | 'الإعلانات' | 'الفعاليات' | 'المستندات' | 'المشرف';

// export type Permission = {
//     [key in PermissionAction]: boolean;
// };

// export type UserPermissions = {
//     [section in PermissionSection]?: Permission;
// };