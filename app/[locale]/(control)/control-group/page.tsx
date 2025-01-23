"use client"
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ListGroupAll, ListDevice, ListImsi } from "@/app/interface/control";
import { useEffect, useState } from "react";
import TableListGroup from "@/app/components/table/group-list";
import { ListLatLong } from "@/app/interface/map";

const controlGroup: React.FC = () => {
  const t = useTranslations("ControlGroup");
  const [dataListGroup, setListGroup] = useState<ListGroupAll[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchGroupAll = async (): Promise<ListGroupAll[]> => {
    setLoading(true);
    try {
      const response = await fetch('/api/group/get-data-group-all' ,
        {
          method: "POST",
          body: JSON.stringify({})
        }); 
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      const data: ListGroupAll[] = res.data;
      setListGroup(data);
      setLoading(false);
      //users.push(newUser);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      return []; 
    }
  };

  const fetchImsiAll = async (): Promise<[]> => {
    try {
      const response = await fetch('/api/service/get-data-imsi-all' ,
        {
          method: "POST",
          body: JSON.stringify({})
        }); 
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      return res.data;
      
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; 
    }
  };

  const fetchPushDataGroup = async (dataGroupName: string) => {

    const res = await fetch("/api/group/push-data-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_name: dataGroupName,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    if (res.status == 200) {
      fetchGroupAll();
      return true;
    } else {
      return false;
    }
  };

  const fetchPushImsiToGroup = async (dataGroupName: string , dataGroupCode: string , dataImsi: string) => {

    const res = await fetch("/api/group/push-imsi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_code: dataGroupCode,
        group_name: dataGroupName,
        imsi: dataImsi,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
      return fetchDataGroupDetail(dataGroupName);;
    } else {
      const data: ListDevice[] = []
      return data
    }
  };

  const fetchDataGroupDetail =  async (dataGroupName: string) : Promise<ListDevice[]> => {
    try {
      const res = await fetch("/api/group/get-data-group-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          group_name: dataGroupName,
          type_search: "OR",
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await res.json();
      const data: ListDevice[] = result.data;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      const data: ListDevice[] = []
      return data;
    }
  };

  const fetchDeleteGroup = async (dataGroupName: string, dataGroupCode : string) => {
       
    const res = await fetch("/api/group/delete-group-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_code: dataGroupCode,
        group_name: dataGroupName,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    console.log(result)
    if (res.status == 200) {
      fetchGroupAll();
    } else {
      
    }
  };


  const fetchDeleteImsiInGroup = async (dataGroupName: string, dataGroupCode: string, imsi : string) => {
       
    const res = await fetch("/api/group/delete-imsi-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        group_code: dataGroupCode,
        group_name: dataGroupName,
        imsi: imsi,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    console.log(result)
    if (res.status == 200) {
      return fetchDataGroupDetail(dataGroupName);
      
    } else {
      const data: ListDevice[] = []
      return data
    }
  };

  const fetchSendCommand = async (typeOpen : string , value : string, commandType : string , dimPercent : string) => {
    
    if(typeOpen === "group"){

      const res = await fetch("/api/group/control-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          type_open: typeOpen,
          group_code: value,
          command_type: commandType,
          dim_percent: dimPercent,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();
      if (res.status == 200) {
        
        return fetchDataLatLong("group", value)
        
      } else {
        const data: ListLatLong[] = []
        return data
      }

    }
    else if(typeOpen === "multi_imsi"){

      const res = await fetch("/api/group/control-imsi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          type_open: typeOpen,
          list_imsi: value,
          command_type: commandType,
          dim_percent: dimPercent,
        }),
      });
  
      const result = await res.json();
      if (res.status == 200) {
        return fetchDataLatLong("imsi", value)
        
      } else {
        const data: ListLatLong[] = []
        return data
      }

    }
    else{
      const data: ListLatLong[] = []
      return data
    }

  };

  const fetchDataLatLong = async (typeSearch: string, dataSearch : string) => {
       
    const res = await fetch("/api/map/get-lat-long", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_search: typeSearch,
        list_value: dataSearch,
        type_group: "code",
        status_lamp: "all",
        type_gps: "mobile_pole_rtu",
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();
    if (res.status == 200) {
      const data: ListLatLong[] = result.data;
      return data;
    } else {
      const data: ListLatLong[] = []
      return data
    }
  };

  const fetchConfigDevice = async (dataGroupName : string ,imsi : string , latLamp : string, longLamp : string , namePole : string , nameGov : string) => {
    
    const res = await fetch("/api/group/config-device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        imsi: imsi,
        lat_lamp: latLamp,
        long_lamp: longLamp,
        name_pole: namePole,
        name_gov: nameGov,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await res.json();
    if (res.status == 200) {
      
      return fetchDataGroupDetail(dataGroupName);
      
    } else {
      const data: ListDevice[] = []
      return data
    }

  };

  useEffect(() => {
    fetchGroupAll();
    fetchImsiAll();
  }, []);


  return (
    <div className="w-full h-auto p-1">
        <TableListGroup 
          loading={loading}
          listGroup={dataListGroup}
          onAddGroup={fetchPushDataGroup} 
          onAddImsiGroup={fetchPushImsiToGroup} 
          onDeleteGroup={fetchDeleteGroup} 
          onDeleteImsiInGroup={fetchDeleteImsiInGroup}
          onSendCommand={fetchSendCommand}
          onReloadLatLong={fetchDataLatLong}
          onDataImsiAll={fetchImsiAll}
          onSaveDataDevice={fetchConfigDevice}
          onDetailGroup={fetchDataGroupDetail}>
        </TableListGroup>
      </div>
  );
}

export default controlGroup;