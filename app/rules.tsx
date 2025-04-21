import { SideNavItem } from './model/side-nav-item';
import { ListAuth } from './interface/auth';
import IconDashboardMonitor from "/public/icon/sidebar/dashboard-monitor.svg";
import IconDashboardChoose from "/public/icon/sidebar/dashboard-choose.svg";
import IconDashboardDaily from "/public/icon/sidebar/dashboard-daily.svg";
import IconControl from "/public/icon/sidebar/control.svg";
import IconControlGroup from "/public/icon/sidebar/control-group.svg";
import IconControlSchedule from "/public/icon/sidebar/control-schedule.svg";
import IconControlIndividual from "/public/icon/sidebar/control-individual.svg";
import IconMap from "/public/icon/sidebar/map.svg";
import IconMapMarker from "/public/icon/sidebar/map-marker.svg";
import IconMapDisconnect from "/public/icon/sidebar/map-disconnect.svg";
import IconSetting from "/public/icon/sidebar/setting.svg";
import IconSettingUser from "/public/icon/sidebar/setting-user.svg";
import IconSettingUserAuth from "/public/icon/sidebar/user-authentication.svg";
import IconSettingAlert from "/public/icon/sidebar/setting-alert.svg";
import IconSignout from "/public/icon/sidebar/sign-out.svg";

  export let AuthRules = (res : ListAuth) => {

    let transformedData: SideNavItem[] = [];
    try {
         transformedData = [
            ...(res.dashboard[0] === 1 || res.groupDashboard[0] === 1 ? [
              {
                title: 'dashboard',
                path: '/dashboard',
                icon: IconDashboardMonitor,
                submenu: true,
                subMenuItems: [
                  { title: 'dashboard-period', 
                    path: '/dashboard-period', 
                    icon: IconDashboardChoose, 
                    status : res.dashboard[0] === 1 ? true : false 
                  },
                  { title: 'dashboard-daily', 
                    path: '/dashboard-daily', 
                    icon: IconDashboardDaily, 
                    status : res.groupDashboard[0] === 1 ? true : false },
                ]
              }
            ] : []),
            
            ...(res.groupConfig[0] === 1 || res.settingSchedule[0] === 1 || res.streetLight[0] === 1 ? [
              {
                title: 'control',
                path: '/control',
                icon: IconControl,
                submenu: true,
                subMenuItems: [
                  { title: 'control-group', 
                    path: '/control-group', 
                    icon: IconControlGroup, 
                    status : res.groupConfig[0] === 1 ? true  : false
                  },
                  { title: 'control-schedule', 
                    path: '/control-schedule', 
                    icon: IconControlSchedule, 
                    status : res.settingSchedule[0] === 1 ? true : false
                  },
                  { title: 'control-individual', 
                    path: '/control-individual', 
                    icon: IconControlIndividual , 
                    status : res.streetLight[0] ? true : false },
                ]
              }
            ] : []),
          
            ...(res.mapGlobal[0] === 1 || res.mapDisconnect[0] === 1 ? [
              {
                title: 'map',
                path: '/map',
                icon: IconMap,
                submenu: true,
                subMenuItems: [
                  { title: 'map-total', 
                    path: '/map-total', 
                    icon: IconMapMarker, 
                    status : res.mapGlobal[0] === 1 ? true : false
                  },
                  { title: 'map-disconnect', 
                    path: '/map-disconnect', 
                    icon: IconMapDisconnect, 
                    status : res.mapDisconnect[0] === 1 ? true : false },
                ]
              }
            ] : []),
          
            ...(res.personal[0] === 1 || res.settingMenu[0] === 1 || res.alertStreetLight[0] === 1 ? [
              {
                title: 'setting',
                path: '/setting',
                icon: IconSetting,
                submenu: true,
                subMenuItems: [
                  { title: 'setting-personal', 
                    path: '/setting-personal', 
                    icon: IconSettingUser, 
                    status : res.personal[0] === 1 ? true : false 
                  },
                  { title: 'setting-menu', 
                    path: '/setting-menu', 
                    icon: IconSettingUserAuth, 
                    status : res.settingMenu[0] === 1 ? true : false 
                  },
                  { title: 'setting-alert', 
                    path: '/setting-alert', 
                    icon: IconSettingAlert, 
                    status : res.alertStreetLight[0] === 1 ? true : false 
                  },
                  
                ]
              }
            ] : []),
          
            ...(res.countLogin === null ? [
              {
                title: 'logout',
                path: '/logout',
                icon: IconSignout,
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