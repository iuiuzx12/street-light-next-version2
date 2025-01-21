export interface ListSchedule {
  dataGroupCode: [];
  dataGroupName: [];
  groupCode: string;
  listDays: [];
  listScenes: Array<any>;
  scheduleName: string;
  typeSchedule: string;
}

export interface ListResponseSchedule {
  dataGroupName: [];
  imsi: string;
  last_update: string;
  status: string;
  time_create: string;
}

export interface SaveSchedule {
  name_schedule: string;
  code_name: string;
  list_group_name_code: string;
  list_scenes_light: string;
  type_schedule: string;
  type_set: string;
  list_days: string;
  version_light_sensor: string;
}
export interface DeleteSchedule {
  name_schedule: string;
  code_name: string;
}
