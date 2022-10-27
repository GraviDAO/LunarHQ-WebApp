export interface SideNavType {
  title: string;
  icon?: string;
  route?: string;
  permissionType?: PermissionType;
  nestedMenuList?: Array<NestedMenu>;
  subMenu?: Array<SideNavType>;
}

export interface NestedMenu {
  title: string;
  route?: string;
}


export enum PermissionType {
  fullAccess = 'full',
  partialAccess = 'partial',
  noAccess = 'none'
}
