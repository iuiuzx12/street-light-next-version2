'use client';

import Image from "next/image";
import { useTranslations } from "next-intl";
import MyChart from "@/app/components/chart/MyChart";
import SeachDashboard from "@/app/components/search/search-dashboard";

export default function dashboardPeriod() {
  const t = useTranslations("DashboardPeriod");

  // Extract the navigation object keys from the translations
  //const navigationKeys = Object.keys(t.raw("navigation"));
  return (
    
      <div className="w-full h-auto p-1">
          {/* <p>{t(`title`)}</p> */}
          <SeachDashboard ></SeachDashboard>
          <MyChart />
      </div>
  );
}
