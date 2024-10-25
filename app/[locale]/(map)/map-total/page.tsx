"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import StaticMapComponent from "@/app/components/map/map-xyz";
import SeachMapTotal from "@/app/components/search/search-map-total";
import { useState } from "react";
import A from "@/app/components/test/A";
import B from "@/app/components/test/B";

export default function mapTotal(props: any) {
  const t = useTranslations("MapTotal");

  const [data, setData] = useState<{
    id: string;
    gateway_id: string;
    imsi: string;
    lat: string;
    lng: string;
    status: string;
    type_schedule: string;
    last_power: string;
    using_sensor: string;
  } | null>(null);

  const handleSendData = (newData: {
    id: string;
    gateway_id: string;
    imsi: string;
    lat: string;
    lng: string;
    status: string;
    type_schedule: string;
    last_power: string;
    using_sensor: string;
  }) => {
    setData(newData);
  };

  return (
    <div>
      <div className="p-1">
        {/* <p>{t(`title`)}</p> */}
        <div className="w-full h-auto">
          <SeachMapTotal onSendData={handleSendData} />
          <StaticMapComponent data={data} />
          
        </div>
      </div>
    </div>
  );
}
