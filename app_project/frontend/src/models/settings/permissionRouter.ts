export interface RouterBase {
  name: string;
  path: string;
  method: string;
  version: number;
}
export interface RouterCreate extends RouterBase {}
export interface RouterUpdate extends RouterBase {}
export interface RouterResponse extends RouterBase {
  id: string;
}

export interface PermissionBase {
  resource: string;
  action: string;
  version: number;
}
export interface PermissionCreate extends PermissionBase {}
export interface PermissionUpdate extends PermissionBase {}
export interface PermissionResponse extends PermissionBase {
  id: string;
}

export interface RouterPermissionBase {
  router_id: string;
  permission_id: string;
  version: number;
}
export interface RouterPermissionCreate extends RouterPermissionBase {}
export interface RouterPermissionUpdate extends RouterPermissionBase {}
export interface RouterPermissionResponse extends RouterPermissionBase {
  id: string;
}

export interface RouterPermissionWithDetails extends RouterPermissionResponse {
  router?: RouterResponse;
  permission?: PermissionResponse;
}
