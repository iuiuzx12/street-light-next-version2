"use client"
import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Skeleton, Card, CardBody} from "@nextui-org/react";
import ButtonModalUserDelete from "./button/btn-user-delete";
import ButtonModalUserEdit from "./button/btn-user-edit";
import ButtonModalUserUsing from "./button/btn-user-using";
import { ListUser } from "@/app/interface/personal";
import { useTranslations } from "next-intl";
import { RuleUserItem } from "@/app/model/rule";

interface TableProps {
  rule : RuleUserItem
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

const TableListUser: React.FC<TableProps> =  ({rule, listUser, dataRule, onDeleteUser , onEditUser , onSetUsable }) => {
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

  const renderCell = React.useCallback((listUser: ListUser, dataRule : [] , columnKey: React.Key , rule : RuleUserItem) => {
    const cellValue = listUser[columnKey as keyof ListUser];
    
    switch (columnKey) {
      case "first_name":
        return (
          <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">{cellValue}</p>
          <p className="text-bold text-sm capitalize text-default-400">{listUser.last_name}</p>
        </div>
        );

      case "edit":
        
        return (
          <div className="flex items-center gap-10" style={{
            placeSelf: "center",
          }}>
            <ButtonModalUserEdit disabled={rule.config ?? false} detailUser={listUser} dataListRule={dataRule} onEditUser={onEditUser}></ButtonModalUserEdit>
        </div>
        );

        case "delete":
        
        return (
          <div className="flex items-center gap-10" style={{
            placeSelf: "center",
          }}>
            <ButtonModalUserDelete disabled={rule.config ?? false} userId={listUser.personal_id} onDelete={onDeleteUser}></ButtonModalUserDelete>
        </div>
        );

        case "use":
        
        return (
          <div className="flex items-center gap-10" style={{
            placeSelf: "center",
          }}>
           
            <ButtonModalUserUsing disabled={rule.config ?? false} userId={listUser.personal_id } usable={listUser.usable} onSetUsable={onSetUsable}></ButtonModalUserUsing>
        </div>
        );
      
      default:
        //return cellValue;
        return <p className="text-bold text-sm capitalize">{cellValue}</p>;
    }
  }, []);

  return (
    <Card className="m-1">
      <CardBody className="overflow-visible p-2 h-[calc(100vh-120px)]">
        <div className="flex w-full flex-col">
          <div className="grid grid-cols-12 gap-2">
        <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg col-span-full">
          <Table
            radius="none"
            shadow="none"
            isStriped
            layout="auto"
            aria-label="Example table with client side pagination"
            bottomContent={
              <div className="py-2 px-2 flex justify-between items-center">
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
              wrapper: "h-[calc(100vh-140px)]",
            }}
          >
            <TableHeader>
              <TableColumn key="first_name">{t(`name`)}</TableColumn>
              <TableColumn key="personal_username">{t(`username`)}</TableColumn>
              <TableColumn key="roleName">{t(`role`)}</TableColumn>
              <TableColumn key="last_login">{t(`time`)}</TableColumn>
              <TableColumn className="text-center" key="edit">{t(`btn-edit-user`)}</TableColumn>
              <TableColumn className="text-center" key="delete">{t(`btn-delete-user`)}</TableColumn>
              <TableColumn className="text-center" key="use">{t(`btn-usable-user`)}</TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.personal_id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, dataRule, columnKey, rule)} </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Skeleton>
        </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default TableListUser;
