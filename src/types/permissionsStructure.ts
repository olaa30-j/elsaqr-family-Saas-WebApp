export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';
export type PermissionSection = 'dashboard' | 'family' | 'financial' | 'members' | 'announcements' | 'events' | 'documents' | 'admin';

export type Permission = {
  [key in PermissionAction]: boolean;
};

export type UserPermissions = {
  [section in PermissionSection]?: Permission;
};

export interface User {
  id: string;
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
