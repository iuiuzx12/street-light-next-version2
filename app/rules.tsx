import { Icon } from '@iconify/react';
import { SideNavItem } from './model/side-nav-item';
import { AuthItem } from './model/auth-item';
import { cookies } from "next/headers";
import { title } from 'process';
import path from 'path';
import { icons } from 'lucide-react';

  export let AuthRules = (res : any) => {

    let transformedData: SideNavItem[] = [];
    try {

         transformedData = [
            ...(res.data.dashboard[0] === 1 || res.data.groupDashboard[0] === 1 ? [
              {
                title: 'dashboard',
                path: '/dashboard',
                icon: '/icon/sidebar/dashboard-monitor.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'dashboard-period', 
                    path: '/dashboard-period', 
                    icon: '/icon/sidebar/dashboard-choose.svg' , 
                    status : res.data.dashboard[0] === 1 ? true : false 
                  },
                  { title: 'dashboard-daily', 
                    path: '/dashboard-daily', 
                    icon: '/icon/sidebar/dashboard-daily.svg', 
                    status : res.data.groupDashboard[0] === 1 ? true : false },
                ]
              }
            ] : []),
            
            ...(res.data.groupConfig[0] === 1 || res.data.settingSchedule[0] === 1 || res.data.streetLight[0] === 1 ? [
              {
                title: 'control',
                path: '/control',
                icon: '/icon/sidebar/control.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'control-group', 
                    path: '/control-group', 
                    icon: '/icon/sidebar/control-group.svg', 
                    status : res.data.groupConfig[0] === 1 ? true  : false
                  },
                  { title: 'control-schedule', 
                    path: '/control-schedule', 
                    icon: '/icon/sidebar/control-schedule.svg', 
                    status : res.data.settingSchedule[0] === 1 ? true : false
                  },
                  { title: 'control-individual', 
                    path: '/control-individual', 
                    icon: '/icon/sidebar/control-individual.svg' , 
                    status : res.data.streetLight[0] ? true : false },
                ]
              }
            ] : []),
          
            ...(res.data.mapGlobal[0] === 1 || res.data.mapDisconnect[0] === 1 ? [
              {
                title: 'map',
                path: '/map',
                icon: '/icon/sidebar/map.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'map-total', 
                    path: '/map-total', 
                    icon: '/icon/sidebar/map-marker.svg', 
                    status : res.data.mapGlobal[0] === 1 ? true : false
                  },
                  { title: 'map-disconnect', 
                    path: '/map-disconnect', 
                    icon: '/icon/sidebar/map-disconnect.svg', 
                    status : res.data.mapDisconnect[0] === 1 ? true : false },
                ]
              }
            ] : []),
          
            ...(res.data.personal[0] === 1 ? [
              {
                title: 'setting',
                path: '/setting',
                icon: '/icon/sidebar/setting.svg',
                submenu: true,
                subMenuItems: [
                  { title: 'setting-personal', 
                    path: '/setting-personal', 
                    icon: '/icon/sidebar/setting-user.svg', 
                    status : true 
                  },
                  { title: 'setting-personal', 
                    path: '/setting-personal', 
                    icon: '/icon/sidebar/setting-user.svg', 
                    status : false 
                  },
                  { title: 'setting-personal', 
                    path: '/setting-personal', 
                    icon: '/icon/sidebar/setting-user.svg', 
                    status : false 
                  },
                  
                ]
              }
            ] : []),
          
            ...(res.data.countLogin === null ? [
              {
                title: 'logout',
                path: '/logout',
                icon: '/icon/sidebar/sign-out.svg',
                submenu: false,
                subMenuItems: []
              }
            ] : [])
          ];
        //console.log(transformedData)

       
        
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    return transformedData;
  };