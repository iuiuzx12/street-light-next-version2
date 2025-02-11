"use client";
import { useTranslations } from "next-intl";
import TableListSchedule from "@/app/components/table/schedule-list";
import { ListResponseSchedule, ListSchedule, SaveSchedule } from "@/app/interface/schedule";
import { useEffect, useState } from "react";
import { ListGroupAll } from "@/app/interface/control";
import { RuleUserItem } from "@/app/model/rule";

export default function dashboardPeriod() {
  const t = useTranslations("ControlSchedule");
  const [loading, setLoading] = useState(true);
  const [dataListSchedule, setListSchedule] = useState<ListSchedule[]>([]);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});

  const fetchSaveData = async (data : SaveSchedule) => {
    const res = await fetch("/api/schedule/save-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.status == 200) {
      if (result.data == true) {
        fetchListSchedule();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const fetchDeleteData = async (codeName : string) => {
    const res = await fetch("/api/schedule/delete-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        json_value : codeName
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      if (result.data == true) {
        fetchListSchedule();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
      return data;
    } catch (error) {
      console.error("Error fetching group all:", error);
      return [];
    }
  };

  const fetchListSchedule = async (): Promise<ListSchedule[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/schedule/get-data", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListSchedule[] = res.data;
      setListSchedule(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching list device:", error);
      return [];
    }
  };

  const fetchListResponse = async (groupCode: string): Promise<ListResponseSchedule[]> => {
    try {
      const response = await fetch("/api/schedule/get-response", {
        method: "POST",
        body: JSON.stringify({
          code_name : groupCode
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      const data: ListResponseSchedule[] = res.data;
      return data;
    } catch (error) {
      console.error("Error fetching list device:", error);
      return [];
    }
  };

  const fetchResendCommand = async (imsi: string , mode : string , lastUpdate : string): Promise<string> => {
    try {
      const response = await fetch("/api/schedule/resend-command", {
        method: "POST",
        body: JSON.stringify({
          imsi : imsi,
          mode: mode,
          last_update : lastUpdate,
          wait_time : "10"
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      return res.data;
    } catch (error) {
      console.error("Error fetching list device:", error);
      return "";
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
          const data: RuleUserItem = {config : result.data.settingSchedule[1] === 1 ? true : false , control : result.data.settingSchedule[2] === 1 ? true : false};
          setDataRule(data);
          return data;
        } else {
          const dataFalse: RuleUserItem = {config : false , control : false};
          setDataRule(dataFalse);
          return dataFalse
        }
      };

  useEffect(() => {
    fetchListSchedule();
    fetchRule();
  }, []);

  return (
    <div className="w-full h-auto p-1">
      <TableListSchedule
        dataRule={dataRule}
        listSchedule={dataListSchedule}
        loading={loading}
        listResponseSchedule={fetchListResponse}
        resendCommad={fetchResendCommand}
        listGroup={fetchGroupAll}
        onSaveData={fetchSaveData}
        onDeleteData={fetchDeleteData}
      ></TableListSchedule>
    </div>
  );
}
