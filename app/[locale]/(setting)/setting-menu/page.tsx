"use client"
import TableSettingMenu from "@/app/components/table/setting-menu";
import { ListAuthMenu } from "@/app/interface/auth";
import { RuleUserItem } from "@/app/model/rule";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function settingMenu() {
  const [data, setData] = useState<ListAuthMenu[]>([]);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});
  const [loading, setLoading] = useState(true);
  const t = useTranslations("SettingMenu");

  const fetchMenu = async (roleId: string): Promise<ListAuthMenu[]> => {
    const res = await fetch("/api/auth/get-menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        role_id: roleId,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await res.json();
    if (res.status == 200) {
      const data: ListAuthMenu[] = result.data;
      data.forEach(item => {
        item.menu_name = t(item.menu_name);
      });
      setData(data);
      setLoading(false);
      return data;
    } else {
      const dataFalse: ListAuthMenu[] = [{menu_id : "1" , control :"1" , menu_name :"null" ,project_id : null , readable : "1" , role_id : null , writeable : "1" , role_menu_id : ""}];
      setData(dataFalse);
      return dataFalse;
    }
  };

  const fetchSettingMenu = async (
    roleId: string,
    value: string
  ) => {
    const res = await fetch("/api/auth/setting-menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        role_id: roleId,
        json_value: value,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await res.json();
    if (res.status == 200) {
      fetchMenu(roleId);
      return true;
    } else {
      return false;
    }
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
        config: result.data.personal[1] === 1 ? true : false,
        control: result.data.personal[2] === 1 ? true : false,
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
    fetchMenu("1");
  }, []);

  return (
    <div className="w-full h-auto p-1">
      <TableSettingMenu
        listAuthMenu={data}
        onChangeRole={fetchMenu}
        onSetting={fetchSettingMenu}
        rule={dataRule}
        loading={loading}
      ></TableSettingMenu>
    </div>
  );
}