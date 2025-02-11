"use client";
import { useTranslations } from "next-intl";

import StaticMapXYZComponent from "@/app/components/map/map-xyz";
import SeachMapTotal from "@/app/components/search/search-map-total";
import { useEffect, useState } from "react";
import { ListLatLong } from "@/app/interface/map";
import { RuleUserItem } from "@/app/model/rule";

export default function mapTotal(props: any) {
  const t = useTranslations("MapTotal");
  const [data, setData] = useState<Array<ListLatLong>>([]);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});
  const handleSendData = (newData: ListLatLong[]) => {
    setData(newData);
  };

  const fetchRule = async (): Promise<RuleUserItem> => {
    const res = await fetch("/api/service/get-data-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await res.json();
    if (res.status == 200) {
      const data: RuleUserItem = {
        config: result.data.mapGlobal[1] === 1 ? true : false,
        control: result.data.mapGlobal[2] === 1 ? true : false,
      };
      setDataRule(data);
      return data;
    } else {
      const dataFalse: RuleUserItem = { config: false, control: false };
      setDataRule(dataFalse);
      return dataFalse;
    }
  };

  useEffect(() => {
      fetchRule();
  }, []);

  return (
    <div>
      <div className="p-1">
        {/* <p>{t(`title`)}</p> */}
        <div className="w-full h-auto">
          <SeachMapTotal onSendData={handleSendData} />
          <StaticMapXYZComponent high="h-[calc(100vh-190px)]" data={data} dataRule={dataRule} />
          
        </div>
      </div>
    </div>
  );
}
