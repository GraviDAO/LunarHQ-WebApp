export interface SideNavType {
  title: string;
  icon?: string;
  route?: string;
  permissionType?: PermissionType;
  nestedMenuList?: Array<string>;
  subMenu?: Array<SideNavType>;
}


export enum PermissionType {
  fullAccess = 'full',
  partialAccess = 'partial',
  noAccess = 'none'
}
