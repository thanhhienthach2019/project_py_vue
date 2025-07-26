export interface RouterBase {
  name: string;
  path: string;
  method: string;
}
export interface RouterCreate extends RouterBase {}
export interface RouterUpdate extends RouterBase {}
export interface RouterResponse extends RouterBase {
  id: number;
}

export interface PermissionBase {
  resource: string;
  action: string;
}
export interface PermissionCreate extends PermissionBase {}
export interface PermissionUpdate extends PermissionBase {}
export interface PermissionResponse extends PermissionBase {
  id: number;
}

export interface RouterPermissionBase {
  router_id: number;
  permission_id: number;
}
export interface RouterPermissionCreate extends RouterPermissionBase {}
export interface RouterPermissionUpdate extends RouterPermissionBase {}
export interface RouterPermissionResponse extends RouterPermissionBase {
  id: number;
}

export interface RouterPermissionWithDetails extends RouterPermissionResponse {
  router?: RouterResponse;
  permission?: PermissionResponse;
}
