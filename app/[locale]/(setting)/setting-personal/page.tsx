"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ListUser } from "@/app/interface/personal";
import TableListUser from "@/app/components/table/user-list";
import ButtonModalUserAdd from "@/app/components/table/button/btn-user-add";
import ServerErrorNotification from "@/app/components/server-error";
import { RuleUserItem } from "@/app/model/rule";

const settingPersonal: React.FC = () => {
  const t = useTranslations("SettingPersonal");
  const [dataListUser, setListUser] = useState<ListUser[]>([]);
  const [dataListRole, setListRole] = useState<[]>([]);
  const [data, setData] = useState<ListUser[]>([]);
  const [dataRule, setDataRule] = useState<RuleUserItem>({});

  const fetchListUser = async (): Promise<ListUser[]> => {
    try {
      const response = await fetch("/api/personal/get-user-list", {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      const res = await response.json();
      const data: ListUser[] = res.dataListUser;
      setListUser(data);
      setListRole(res.dataListRole);
      setData(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchSaveDataUser = async (
    personalId: string,
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    role: string,
    type: string,
  ) => {
    const res = await fetch("/api/personal/save-data-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        personal_id: personalId,
        personal_firstname: firstname,
        personal_lastname: lastname,
        personal_username: username,
        personal_password: password,
        cmb_role: role,
        actionData: type,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      fetchListUser();
      return true;
    } else {
      fetchListUser();
      return false;
    }
  };

  const fetchDeleteUserName = async (userId: string) => {
    const res = await fetch("/api/personal/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        personal_id: userId,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      fetchListUser();
      if (result.data == true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const fetchSetUserUsable = async (userId: string , status : string) => {
    const res = await fetch("/api/personal/set-usable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        personal_id: userId,
        status : status
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      fetchListUser();
      if (result.data == "1") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
            const data: RuleUserItem = {config : result.data.personal[1] === 1 ? true : false , control : result.data.personal[2] === 1 ? true : false};
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
    fetchListUser();
  }, []);

  return (
    <div>
      <div className="w-full h-auto">
          <div className="p-2">
            <ButtonModalUserAdd
              rule={dataRule.config ?? false}
              dataRule={dataListRole}
              onSendData={fetchSaveDataUser}
            ></ButtonModalUserAdd>
            
          </div>

          <div className="w-full h-auto p-1">
            <TableListUser
              rule={dataRule}
              listUser={dataListUser}
              dataRule={dataListRole}
              onSetUsable={fetchSetUserUsable}
              onDeleteUser={fetchDeleteUserName}
              onEditUser={fetchSaveDataUser}
            />
          </div>
        </div>
    </div>
  );
};

export default settingPersonal;
