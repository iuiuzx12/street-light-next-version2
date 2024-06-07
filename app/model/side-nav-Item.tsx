export type SideNavItem = {
    title?: string;
    path?: string;
    icon?: string;
    submenu?: boolean;
    subMenuItems?: SideNavItem[];
  };