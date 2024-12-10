export interface ListGroupAll {
    group_code: string;
    group_name: string;
    sub_district: string;
    total_rtu: string;
}

export interface ListImsi {
    key: string;
    value: string;
}

export interface ListDevice {
    gov_name : string , 
    group_name : string, 
    imsi : string,
    last_command : string, 
    last_power : string,
    last_update : string ,
    project_name : string,
    street_light_name : string,
    time_stamp : string ,
    status : string ,
    lat : string ,
    long : string ,
    total_rtu : string ,
    power_total : string
}
