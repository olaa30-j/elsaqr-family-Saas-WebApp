import type { PermissionAction, PermissionSection } from "./permissionsStructure";

export interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredSection?: PermissionSection;
  requiredAction?: PermissionAction;
}

export interface PermissionItem {
  section: PermissionSection;
  action: PermissionAction;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}