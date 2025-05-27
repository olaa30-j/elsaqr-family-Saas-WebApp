import { type User, type PermissionSection, type PermissionAction, isPermissionSection, isPermissionAction } from "../types/permissionsStructure";


export const hasPermission = (
  user: User | null,
  section: string,
  action: string
): boolean => {
  if (!user) return false;
  
  // Super admin لديه جميع الصلاحيات
  if (user.role === 'super_admin') return true;
  
  // التحقق من أن section صالحة
  if (!isPermissionSection(section)) return false;
  
  // التحقق من وجود الصلاحيات لهذا القسم
  if (!user.permissions[section]) return false;
  
  // التحقق من أن action صالحة
  if (!isPermissionAction(action)) return false;
  
  // التحقق من الصلاحية المحددة
  return user.permissions[section][action] === true;
};

export const checkRoutePermissions = (user: User | null, pathname: string): boolean => {
  const routePermissions: Record<string, { section: PermissionSection; action: PermissionAction }> = {
    '/dashboard': { section: 'dashboard', action: 'view' },
    '/family': { section: 'family', action: 'view' },
    '/family/create': { section: 'family', action: 'create' },
  };

  const permission = routePermissions[pathname];
  if (!permission) return true;  
  
  return hasPermission(user, permission.section, permission.action);
};

export const verifyActionPermission = async (
  section: PermissionSection,
  action: PermissionAction,
  data?: any
) => {
  try {
    const response = await fetch('/api/permissions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section, action, data }),
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

