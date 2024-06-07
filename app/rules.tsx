import { Icon } from '@iconify/react';
import { SideNavItem } from './model/side-nav-Item';

export const RuleAdminManagement: SideNavItem[] = [
    {
        title: 'dashboard',
        path: '/dashboard',
        //icon: <Icon icon="lucide:folder" width="24" height="24" />,
        icon: '/icon/sidebar/dashboard-monitor.svg',
        submenu: true,
        subMenuItems: [
            { title: 'dashboard-period', path: '/dashboard-period', icon: '/icon/sidebar/dashboard-choose.svg' },
            { title: 'dashboard-daily', path: '/dashboard-daily', icon: '/icon/sidebar/dashboard-daily.svg' },
        ],
    },
    {
        title: 'control',
        path: '/control',
        icon: '/icon/sidebar/control.svg',
        submenu: true,
        subMenuItems: [
            { title: 'control-group', path: '/control-group' , icon: '/icon/sidebar/control-group.svg'},
            { title: 'control-schedule', path: '/control-schedule' ,icon: '/icon/sidebar/control-schedule.svg'},
            { title: 'control-individual', path: '/control-individual' ,icon: '/icon/sidebar/control-individual.svg'},
        ],
    },
    {
        title: 'map',
        path: '/map',
        icon: '/icon/sidebar/map.svg',
        submenu: true,
        subMenuItems: [
            { title: 'map-total', path: '/map-total' , icon: '/icon/sidebar/map-marker.svg'},
            { title: 'map-disconnect', path: '/map-disconnect' ,icon: '/icon/sidebar/map-disconnect.svg'},
        ],
    },
    {
        title: 'logout',
        path: '/logout',
        icon: '/icon/sidebar/sign-out.svg',
    },
];

export const RuleAdmin: SideNavItem[] = [
    {
        title: 'dashboard',
        path: '/dashboard',
        //icon: <Icon icon="lucide:folder" width="24" height="24" />,
        icon: '/icon/sidebar/dashboard-monitor.svg',
        submenu: true,
        subMenuItems: [
            { title: 'dashboard-period', path: '/dashboard-period', icon: '/icon/sidebar/dashboard-choose.svg' },
            { title: 'dashboard-daily', path: '/dashboard-daily', icon: '/icon/sidebar/dashboard-daily.svg' },
        ],
    },
    // {
    //     title: 'control',
    //     path: '/control',
    //     icon: '/icon/sidebar/control.svg',
    //     submenu: true,
    //     subMenuItems: [
    //         { title: 'control-group', path: '/control-group' , icon: '/icon/sidebar/control-group.svg'},
    //         { title: 'control-schedule', path: '/control-schedule' ,icon: '/icon/sidebar/control-schedule.svg'},
    //         { title: 'control-individual', path: '/control-individual' ,icon: '/icon/sidebar/control-individual.svg'},
    //     ],
    // },
    {
        title: 'logout',
        path: '/logout',
        icon: '/icon/sidebar/dashboard-monitor.svg',
    },
];