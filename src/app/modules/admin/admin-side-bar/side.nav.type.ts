export interface SideNavType {
  title: string;
  icon?: string;
  route?: string;
  subMenu?: Array<SideNavType>
}
