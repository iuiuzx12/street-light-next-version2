"use client"
import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Skeleton} from "@nextui-org/react";
import ButtonModalUserDelete from "./button/btn-user-delete";
import ButtonModalUserEdit from "./button/btn-user-edit";
import ButtonModalUserUsing from "./button/btn-user-using";
import { ListUser } from "@/app/interface/personal";
import { useTranslations } from "next-intl";

interface TableProps {
  listUser: ListUser[];
  dataRule : [];
  onSetUsable : (userId : string, status : string) => void;
  onDeleteUser : (userId: string) => void;
  onEditUser : (
    personalId : string, 
    firstname : string, 
    lastname : string,
    username : string, 
    password : string,
    role : string ,
    type : string) => void;
}

const TableListUser: React.FC<TableProps> =  ({ listUser, dataRule, onDeleteUser , onEditUser , onSetUsable }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const rowsPerPage = 10;
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(listUser.length / rowsPerPage);
  const t = useTranslations("SettingPersonal");
  
  useEffect(() => {
    setPage(1)
    setIsLoaded(true)

  }, [dataRule]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return listUser.slice(start, end);
  }, [page, listUser]);

  const renderCell = React.useCallback((listUser: ListUser, dataRule : [] , columnKey: React.Key) => {
    const cellValue = listUser[columnKey as keyof ListUser];
    
    switch (columnKey) {
      case "first_name":
        return (
          <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">{cellValue}</p>
          <p className="text-bold text-sm capitalize text-default-400">{listUser.last_name}</p>
        </div>
        );

      case "actions":
        
        return (
          <div className="flex items-center gap-10" style={{
            placeSelf: "center",
          }}>
            <ButtonModalUserEdit detailUser={listUser} dataListRule={dataRule} onEditUser={onEditUser}></ButtonModalUserEdit>
            <ButtonModalUserDelete userId={listUser.personal_id} onDelete={onDeleteUser}></ButtonModalUserDelete>
            <ButtonModalUserUsing userId={listUser.personal_id } usable={listUser.usable} onSetUsable={onSetUsable}></ButtonModalUserUsing>
        </div>
        );
      
      default:
        //return cellValue;
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
    }
  }, []);

  return (

        <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
          <Table
            isStriped
            aria-label="Example table with client side pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "h-[calc(100vh-120px)]",
            }}
          >
            <TableHeader>
              <TableColumn key="first_name">{t(`name`)}</TableColumn>
              <TableColumn key="personal_username">{t(`username`)}</TableColumn>
              <TableColumn key="roleName">{t(`role`)}</TableColumn>
              <TableColumn key="last_login">{t(`time`)}</TableColumn>
              <TableColumn className="text-center" key="actions">{t(`action`)}</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.personal_id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, dataRule, columnKey)} </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Skeleton>
  );
}

export default TableListUser;
