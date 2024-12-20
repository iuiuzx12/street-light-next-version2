export interface ListDeviceInGroup {
    imeI_Name : string , 
    gatewayId : string, 
    lastPower : string,
    lastUpdate : string, 
    latitude : string,
    lifeTime : string ,
    longitude : string,
    streetLightCommand : [],
    streetLightGroups : [] ,
    streetLightLastUpdate : string ,
    streetLightName : string ,
    streetLightSerial : string ,
    streetLightStatus : string ,
    typeSchedule : string
    usingSensor : boolean
}

export interface ListLogDevice {
    //da : string , 
    data : [{
        id : number, 
        i : string, 
        pf : string,
        ts : string, 
        v : string,
        w : string ,
        date : string,
        time : string
    }],
    averageWatt :string,
    averageVolt : string,
    averageI : string
}

export interface ListLogDeviceNotAverage {
  id: number;
  i: string;
  pf: string;
  ts: string;
  v: string;
  w: string;
  date: string;
  time: string;
}

export interface ListLogDeviceUserControl {
    id: number;
    date: string;
    dim: string;
    response: string;
    time: string;
    ts: string;
  }