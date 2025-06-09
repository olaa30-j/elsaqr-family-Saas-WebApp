import type { PermissionAction, PermissionEntity } from "./permissionsStructure";

export interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredSection?: PermissionEntity;
  requiredAction?: PermissionAction;
}

export interface PermissionItem {
  entity: PermissionEntity;
  action: PermissionAction;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}