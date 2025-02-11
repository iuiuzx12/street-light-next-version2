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
  ChipProps,
  SortDescriptor,
  Skeleton,
  Card,
  CardBody,
  ScrollShadow,
  Progress
} from "@nextui-org/react";
import {Search} from 'lucide-react';

import { ListGroupAll, ListDevice, ListImsi } from "@/app/interface/control";
import ButtonModalAddGroup from "./button/btn-group-add";
import ButtonModelControl from "./button/btn-group-control";
import ButtonModelDelete from "./button/btn-group-delete";
import ButtonModelListImsi from "./button/btn-group-add-imsi";
import { ListLatLong } from "@/app/interface/map";
import { useTranslations } from "next-intl";
import { RuleUserItem } from "@/app/model/rule";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["group_name", "sub_district", "total_rtu", "actions"];

interface TableProps {
    dataRule : RuleUserItem;
    loading : boolean;
    listGroup: ListGroupAll[];
    onAddGroup : (dataGroupName: string) => void;
    onAddImsiGroup : (dataGroupName: string ,dataGroupCode: string, dataImsi: string) => Promise<ListDevice[]>;
    onDeleteGroup : (dataGroupName: string, dataGroupCode: string) => void;
    onDataImsiAll : () => Promise<ListImsi[]>;
    onDeleteImsiInGroup : (dataGroupName: string,dataGroupCode: string, dataImsi : string) => Promise<ListDevice[]>;
    onSaveDataDevice : (dataGroupName : string ,imsi : string , latLamp : string, longLamp : string , namePole : string , nameGov : string) => Promise<ListDevice[]>;
    onReloadLatLong : (typeSearch : string, dataSearch : string) => Promise<ListLatLong[]>;
    onSendCommand : (typeOpen : string , value : string, commandType : string , dimPercent : string) => Promise<ListLatLong[]>;
    onDetailGroup : (
        group_name : string) => Promise<ListDevice[]>;
  }

  

const TableListGroup: React.FC<TableProps> = ({
  dataRule,
  loading,
  listGroup,
  onAddGroup,
  onAddImsiGroup,
  onDeleteGroup,
  onDeleteImsiInGroup,
  onDetailGroup,
  onDataImsiAll,
  onSendCommand,
  onSaveDataDevice,
  onReloadLatLong
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
  const [dataRuletest, setDataRule] = React.useState(dataRule);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "group_name",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const t = useTranslations("ControlGroup");

  const columns = [
    { name: t(`group`), uid: "group_name", sortable: true },
    { name: t(`subdistrict`), uid: "sub_district", sortable: true },
    { name: t(`actions`) , uid: "actions" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredGruop = [...listGroup];

    if (hasSearchFilter) {
      filteredGruop = filteredGruop.filter((data) =>
        data.group_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGruop;
  }, [listGroup, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ListGroupAll, b: ListGroupAll) => {
      const first = a[sortDescriptor.column as keyof ListGroupAll] as string;
      const second = b[sortDescriptor.column as keyof ListGroupAll] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  

  const renderCell = React.useCallback(
    
    (groupAll: ListGroupAll, columnKey: React.Key , dataRule : RuleUserItem) => {
        
      const cellValue = groupAll[columnKey as keyof ListGroupAll];

      switch (columnKey) {
        case "group_name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {groupAll.group_code}
              </p>
            </div>
          );

        case "actions":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
              <ButtonModelControl
                rule={dataRule}
                groupName={groupAll.group_name}
                groupCode={groupAll.group_code}
                onDetail={onDetailGroup}
                onReloadLatLong={onReloadLatLong}
                onSendCommand={onSendCommand}
              />

              <ButtonModelListImsi
                disabled={dataRule.config ?? false}
                groupName={groupAll.group_name}
                groupCode={groupAll.group_code}
                onDetail={onDetailGroup}
                onAddImsiGroup={onAddImsiGroup}
                onDataImsiAll={onDataImsiAll}
                onDeleteImsiInGroup={onDeleteImsiInGroup}
                onSaveDataDevice={onSaveDataDevice}
              />

              <ButtonModelDelete
                disabled={dataRule.config ?? false}
                groupName={groupAll.group_name}
                groupCode={groupAll.group_code}
                onSendData={onDeleteGroup}
              />

             
            </div>
          );

        default:
            //setIsLoaded(true)
            return cellValue;
      }
    },
    []
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
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={t(`search-by-group`)}
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <ButtonModalAddGroup onSendData={onAddGroup}></ButtonModalAddGroup>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-group`)} {listGroup.length}
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
    listGroup.length,
    hasSearchFilter,
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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody 
                isLoading={loading}
                loadingContent={<Progress isIndeterminate aria-label="Loading..." className="w-full mt-auto" size="sm" />}
                emptyContent={t(`no-group-found`)} items={sortedItems}>
              {(item) => (
                <TableRow key={item.group_code}>
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

export default TableListGroup;