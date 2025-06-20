"use client";
import TableListDevice from "@/app/components/table/individual-list";
import { ListGroupAll } from "@/app/interface/control";
import { ListDeviceInGroup, ListLogDevice, ListLogDeviceUserControl } from "@/app/interface/individual";
import { RuleUserItem } from "@/app/model/rule";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const controlIndividual: React.FC = () => {
  const t = useTranslations("ControlIndividual");
  const [dataListDevice, setListDevice] = useState<ListDeviceInGroup[]>([]);
  const [dataListGroup, setListGroup] = useState<ListGroupAll[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});

  const fetchListDevice = async ( dataGroupName: string ): Promise<ListDeviceInGroup[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/individual/device-in-group", {
        method: "POST",
        body: JSON.stringify({
          list_group: JSON.stringify([dataGroupName]),
          operator_select: "and",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListDeviceInGroup[] = res.data;
      setListDevice(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching list device:", error);
      return [];
    }
  };

  const fetchGroupAll = async (): Promise<ListGroupAll[]> => {
    try {
      const response = await fetch("/api/group/get-data-group-all", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListGroupAll[] = res.data;
      setListGroup(data);
      return data;
    } catch (error) {
      console.error("Error fetching group all:", error);
      return [];
    }
  };

  const fetchListLogPower = async ( deviceId: string, day : string ): Promise<ListLogDevice> => {
    try {
      const response = await fetch("/api/individual/get-device-log", {
        method: "POST",
        body: JSON.stringify({
          imsi: deviceId,
          day: day,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListLogDevice = res;

      return data;
    } catch (error) {
      console.error("Error fetching list log power:", error);
      const data: ListLogDevice = {data : [{ id : 1, i : "", pf : "",ts : "" ,v : "",w : "",date : "",time : ""}], averageWatt : "", averageVolt : "", averageI : ""};
      return data;
    }
  };

  const fetchLogUserControl = async (deviceId: string, day : string): Promise<ListLogDeviceUserControl[]> => {
    try {
      const response = await fetch("/api/individual/get-device-user-control", {
        method: "POST",
        body: JSON.stringify({
          imsi: deviceId,
          day: day,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListLogDeviceUserControl[] = res.data;
      return data;
    } catch (error) {
      console.error("Error fetching group all:", error);
      return [];
    }
  };

  const fetchRule = async () : Promise<RuleUserItem> => {
      const res = await fetch("/api/service/get-data-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({}),
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await res.json();
      if (res.status == 200) {
        const data: RuleUserItem = {config : result.data.streetLight[1] === 1 ? true : false , control : result.data.streetLight[2] === 1 ? true : false};
        setDataRule(data);
        return data;
      } else {
        const dataFalse: RuleUserItem = {config : false , control : false};
        setDataRule(dataFalse);
        return dataFalse
      }
    };

  useEffect(() => {
    fetchRule();
    fetchListDevice("ALL");
    fetchGroupAll();
  }, []);

  return (
    <div className="w-full h-auto p-1">
      <TableListDevice
        dataRule={dataRule}
        listDevice={dataListDevice}
        listGroup={dataListGroup}
        loading={loading}
        onListDevice={fetchListDevice}
        onListLogDevice={fetchListLogPower}
        onListLogDeviceUserControl={fetchLogUserControl}
      ></TableListDevice>
    </div>
  );
};

export default controlIndividual;
