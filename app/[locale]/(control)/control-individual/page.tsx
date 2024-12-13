"use client";
import TableListDevice from "@/app/components/table/individual-list";
import { ListGroupAll } from "@/app/interface/control";
import { ListDeviceInGroup } from "@/app/interface/individual";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const controlIndividual: React.FC = () => {
  const t = useTranslations("ControlIndividual");
  const [dataListDevice, setListDevice] = useState<ListDeviceInGroup[]>([]);
  const [dataListGroup, setListGroup] = useState<ListGroupAll[]>([]);

  const fetchListDevice = async ( dataGroupName: string ): Promise<ListDeviceInGroup[]> => {
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
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
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
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchListDevice("ALL");
    fetchGroupAll();
  }, []);

  return (
    <div className="w-full h-auto p-1">
      <TableListDevice
        listDevice={dataListDevice}
        listGroup={dataListGroup}
        //listGroup={dataListGroup}
        onListDevice={fetchListDevice}
      ></TableListDevice>
    </div>
  );
};

export default controlIndividual;
