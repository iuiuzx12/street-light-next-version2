"use client";
import { useTranslations } from "next-intl";

import StaticMapXYZComponent from "@/app/components/map/map-xyz";
import SeachMapTotal from "@/app/components/search/search-map-total";
import { useState } from "react";
import { ListLatLong } from "@/app/interface/map";

export default function mapTotal(props: any) {
  const t = useTranslations("MapTotal");
  const [data, setData] = useState<Array<ListLatLong>>([]);
  const handleSendData = (newData: ListLatLong[]) => {
    setData(newData);
    console.log(newData)
  };

  return (
    <div>
      <div className="p-1">
        {/* <p>{t(`title`)}</p> */}
        <div className="w-full h-auto">
          <SeachMapTotal onSendData={handleSendData} />
          <StaticMapXYZComponent high="h-[calc(100vh-190px)]" data={data} />
          
        </div>
      </div>
    </div>
  );
}
