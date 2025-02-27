import { SideNavItem } from './model/side-nav-item';
import { ListAuth } from './interface/auth';

  export let AuthRules = (res : ListAuth) => {

    let transformedData: SideNavItem[] = [];
    try {
         transformedData = [
            ...(res.dashboard[0] === 1 || res.groupDashboard[0] === 1 ? [
              {
                title: 'dashboard',
                path: '/dashboard',
                icon: '/icon/sidebar/dashboard-monitor.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'dashboard-period', 
                    path: '/dashboard-period', 
                    icon: '/icon/sidebar/dashboard-choose.svg' , 
                    status : res.dashboard[0] === 1 ? true : false 
                  },
                  { title: 'dashboard-daily', 
                    path: '/dashboard-daily', 
                    icon: '/icon/sidebar/dashboard-daily.svg', 
                    status : res.groupDashboard[0] === 1 ? true : false },
                ]
              }
            ] : []),
            
            ...(res.groupConfig[0] === 1 || res.settingSchedule[0] === 1 || res.streetLight[0] === 1 ? [
              {
                title: 'control',
                path: '/control',
                icon: '/icon/sidebar/control.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'control-group', 
                    path: '/control-group', 
                    icon: '/icon/sidebar/control-group.svg', 
                    status : res.groupConfig[0] === 1 ? true  : false
                  },
                  { title: 'control-schedule', 
                    path: '/control-schedule', 
                    icon: '/icon/sidebar/control-schedule.svg', 
                    status : res.settingSchedule[0] === 1 ? true : false
                  },
                  { title: 'control-individual', 
                    path: '/control-individual', 
                    icon: '/icon/sidebar/control-individual.svg' , 
                    status : res.streetLight[0] ? true : false },
                ]
              }
            ] : []),
          
            ...(res.mapGlobal[0] === 1 || res.mapDisconnect[0] === 1 ? [
              {
                title: 'map',
                path: '/map',
                icon: '/icon/sidebar/map.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'map-total', 
                    path: '/map-total', 
                    icon: '/icon/sidebar/map-marker.svg', 
                    status : res.mapGlobal[0] === 1 ? true : false
                  },
                  { title: 'map-disconnect', 
                    path: '/map-disconnect', 
                    icon: '/icon/sidebar/map-disconnect.svg', 
                    status : res.mapDisconnect[0] === 1 ? true : false },
                ]
              }
            ] : []),
          
            ...(res.personal[0] === 1 || res.settingMenu[0] === 1 || res.alertStreetLight[0] === 1 ? [
              {
                title: 'setting',
                path: '/setting',
                icon: '/icon/sidebar/setting.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'setting-personal', 
                    path: '/setting-personal', 
                    icon: '/icon/sidebar/setting-user.svg', 
                    status : res.personal[0] === 1 ? true : false 
                  },
                  { title: 'setting-menu', 
                    path: '/setting-menu', 
                    icon: '/icon/sidebar/user-authentication.svg', 
                    status : res.settingMenu[0] === 1 ? true : false 
                  },
                  { title: 'setting-alert', 
                    path: '/setting-alert', 
                    icon: '/icon/sidebar/setting-alert.svg', 
                    status : res.alertStreetLight[0] === 1 ? true : false 
                  },
                  
                ]
              }
            ] : []),
          
            ...(res.countLogin === null ? [
              {
                title: 'logout',
                path: '/logout',
                icon: '/icon/sidebar/sign-out.svg',
                submenu: false,
                subMenuItems: []
              }
            ] : [])
          ];

       
        
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    return transformedData;
  };