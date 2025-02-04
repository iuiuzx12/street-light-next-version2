"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Selection,
  SortDescriptor,
  Skeleton,
  Card,
  CardBody,
  Progress,
  ButtonGroup
} from "@nextui-org/react";
import {Edit2, Hand, Search, Sunset, Timer} from 'lucide-react';

import { ListResponseSchedule, ListSchedule, SaveSchedule, } from "@/app/interface/schedule";
import { useTranslations } from "next-intl";
import ButtonModelDeleteSchedule from "./button/btn-schedule-delete";
import ButtonModelEditAddSchedule from "./button/btn-schedule-edit-add";
import ButtonModelResponseSchedule from "./button/btn-schedule-response";
import { ListGroupAll } from "@/app/interface/control";
import { RuleUserItem } from "@/app/model/rule";

const INITIAL_VISIBLE_COLUMNS = ["scheduleName", "typeSchedule", "edit", "response" , "delete"];
interface TableProps {
    dataRule: RuleUserItem;
    loading: boolean;
    listSchedule: ListSchedule[];
    listGroup : () => Promise<ListGroupAll[]>;
    listResponseSchedule : (groupCode : string) => Promise<ListResponseSchedule[]>;
    resendCommad : (imsi: string , mode : string , lastUpdate : string) => Promise<string>;
    onSaveData: ( data : SaveSchedule) => void;
    onDeleteData: ( codeName : string) => void;
  }

const TableListSchedule: React.FC<TableProps> = ({
    dataRule,
    loading,
    listSchedule,
    resendCommad,
    listResponseSchedule,
    listGroup,
    onSaveData,
    onDeleteData
}) => {
  
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "scheduleName",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const t = useTranslations("ControlSchedule");

  const columns = [
    { name: t(`name`) , uid: "scheduleName", sortable: true , align : "start" },
    { name: t(`type`), uid: "typeSchedule", sortable: true , align : "start" },
    { name: t(`edit`), uid: "edit" , align : "center" },
    { name: t(`status`), uid: "response" , align : "center"},
    { name: t(`delete`) , uid: "delete", align : "center" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredGroup = [...listSchedule];

    if (hasSearchFilter) {
      filteredGroup = filteredGroup.filter((data) =>
        data.scheduleName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGroup;
  }, [listSchedule, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage ,listGroup]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ListSchedule, b: ListSchedule) => {
      const first = a[sortDescriptor.column as keyof ListSchedule] as string;
      const second = b[sortDescriptor.column as keyof ListSchedule] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items ,listGroup]);
  
  const renderCell = React.useCallback(
    (data: ListSchedule, columnKey: React.Key , dataRule : RuleUserItem) => {
      const cellValue = data[columnKey as keyof ListSchedule];

      switch (columnKey) {
        case "scheduleName":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {data.groupCode}
              </p>
            </div>
          );

        case "edit":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
              <ButtonModelEditAddSchedule
                type="edit"
                disabled={dataRule.config ?? false}
                dataDetail={data}
                dataListGroup={listGroup}
                onSaveData={onSaveData}
              ></ButtonModelEditAddSchedule>
            </div>
          );

        case "response":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
              <ButtonModelResponseSchedule
                type={data.typeSchedule}
                groupCode={data.groupCode}
                listResponseSchedule={listResponseSchedule}
                resendCommad={resendCommad}
              ></ButtonModelResponseSchedule>
            </div>
          );

        case "typeSchedule":
          return (
            <div>
              <ButtonGroup>
                <Button
                  isDisabled
                  size="md"
                  className="w-32 justify-start"
                  radius="md"
                >
                  {t(cellValue)}
                </Button>
                <Button
                  isIconOnly
                  isDisabled
                  className="bg-gradient-to-tr text-white shadow-lg -m-15 from-blue-500 to-blue-300"
                >
                  {  cellValue === "time" ? <Timer color="white"/> : cellValue === "manual"  ? <Hand color="white"/> : <Sunset color="white"/> }
                </Button>
              </ButtonGroup>
            </div>
          );

        case "delete":
          const resultGroupNameCode = data.dataGroupName.map(
            (item, index) => `${item}$${data.dataGroupCode[index]}`
          );
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
              <ButtonModelDeleteSchedule
                disabled={dataRule.config ?? false}
                nameSchedule={data.scheduleName}
                groupCode={data.groupCode}
                nameCode={JSON.stringify(resultGroupNameCode)}
                onDeleteData={onDeleteData}
                onSaveData={onSaveData}
              ></ButtonModelDeleteSchedule>
            </div>
          );

        default:
          //setIsLoaded(true)
          return cellValue;
      }
    },
    [listGroup]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 ">
          <Input
            size="md"
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={t(`search-by-name`)}
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 self-end">
          <ButtonModelEditAddSchedule disabled={dataRule.config ?? false} type="add" dataDetail={null} dataListGroup={listGroup} onSaveData={onSaveData}></ButtonModelEditAddSchedule>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-setting`)} {listSchedule.length}
          </span>
          <label className="flex items-center text-default-400 text-small">
            {t(`rows-per-page`)}
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    listSchedule.length,
    hasSearchFilter,
    listGroup
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            aria-label="previous"
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {t(`previous`)}
          </Button>
          <Button
            aria-label="next"
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {t(`next`)}
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter ,listGroup]);

  return (
    <Card className="m-1">
      <CardBody className="overflow-visible p-2 h-[calc(100vh-70px)]">
        <div className="flex w-full flex-col">
          <div className="grid grid-cols-12 gap-2">

          <Table
            className="col-span-full"
            radius="none"
            shadow="none"
            isStriped
            layout="auto"
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "h-[calc(100vh-250px)]",
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.align === "start" ? "start" : "center"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody 
              isLoading={loading}
              loadingContent={<Progress isIndeterminate aria-label="Loading..." className="w-full mt-auto" size="sm" />}
              emptyContent={t(`no-setting-found`)} 
              items={sortedItems}>
              {(item) => (
                <TableRow key={item.groupCode}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey, dataRule)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TableListSchedule;