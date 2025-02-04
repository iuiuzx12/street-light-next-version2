export type SideNavItem = {
    title: string;
    path: string;
    icon: string;
    submenu: boolean;
    subMenuItems: SideSubMenuItems[];
  };

  export type SideSubMenuItems = {
    title: string;
    path: string;
    icon: string;
    status : boolean;
  };