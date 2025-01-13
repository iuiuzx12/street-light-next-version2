"use client";
import { useTranslations } from "next-intl";
import TableListSchedule from "@/app/components/table/schedule-list";
import { ListSchedule } from "@/app/interface/schedule";
import { useEffect, useState } from "react";

export default function dashboardPeriod() {
  const t = useTranslations("ControlSchedule");
  const [loading, setLoading] = useState(true);
  const [dataListSchedule, setListSchedule] = useState<ListSchedule[]>([]);

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

   useEffect(() => {
      fetchListSchedule();
    }, []);

  return (
    <div className="w-full h-auto p-1">
      <TableListSchedule listSchedule={dataListSchedule} loading={loading}></TableListSchedule>
    </div>
  );
}