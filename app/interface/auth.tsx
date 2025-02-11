export interface ListAuth {
  projectName: string;
  userId: string;
  firstName: string;
  lastName: string;
  userRoleId: string;
  userRole: string;
  userName: string;
  lastToken: string;
  countLogin: null;
  alertStreetLight: number[];
  dashboard: number[];
  groupConfig: number[];
  groupDashboard: number[];
  maintenanceConfig: number[];
  maintenanceDashboard: number[];
  mapDisconnect: number[];
  mapGlobal: number[];
  personal: number[];
  settingMenu: number[];
  settingSchedule: number[];
  streetLight: number[];
  maintenanceDetail: number[];
  mapChangeLamp: number[];
  comingSoon: number[];
}

export interface ListAuthMenu {
  menu_id: string;
  menu_name: string;
  role_menu_id: string;
  role_id: null;
  readable: string;
  writeable: string;
  control: string;
  project_id: null;
}
