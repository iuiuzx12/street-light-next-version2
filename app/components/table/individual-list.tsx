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
  Autocomplete,
  AutocompleteItem
} from "@nextui-org/react";
import {Search} from 'lucide-react';

import { ListGroupAll } from "@/app/interface/control";
import { useTranslations } from "next-intl";
import { ListDeviceInGroup } from "@/app/interface/individual";
import ButtonModelListIndividualLog from "./button/btn-individual-log";
import ButtonModelListIndividualWorking from "./button/btn-individual-working";
import ButtonModelIndividualCommand from "./button/btn-individual-command";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["imeI_Name", "streetLightName", "streetLightSerial","streetLightGroups", "streetLightLastUpdate","lifeTime","streetLightCommand", "command" , "data", "working" , "mode"];

interface TableProps {
    listGroup: ListGroupAll[];
    listDevice: ListDeviceInGroup[];
    onListDevice: (dataGroupName: string) => Promise<ListDeviceInGroup[]>;
  }

const TableListDevice: React.FC<TableProps> = ({
  listGroup,
  listDevice,
  onListDevice
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
    column: "imeI_Name",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const t = useTranslations("ControlGroup");
  const [dataSearchGroup, setdataSearchGroup] = useState<string>("ALL");

  const columns = [
    //{ name: t(`group`), uid: "imeI_Name", sortable: true },
    { name: t(`subdistrict`), uid: "streetLightName", sortable: true , align : "start" },
    { name: t(`subdistrict`), uid: "streetLightSerial", sortable: true , align : "start" },
    { name: t(`subdistrict`), uid: "streetLightGroups", sortable: true, align : "start"  },
    { name: t(`subdistrict`), uid: "streetLightLastUpdate", sortable: true , align : "start" },
    { name: t(`subdistrict`), uid: "lifeTime", sortable: true, align : "start"  },
    { name: t(`subdistrict`), uid: "streetLightCommand", sortable: true , align : "start" },
    { name: t(`actions`) , uid: "command" , align : "center" },
    { name: t(`actions`) , uid: "data", align : "center"  },
    { name: t(`actions`) , uid: "working", align : "center" },
    { name: t(`actions`) , uid: "mode" , align : "center" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredGruop = [...listDevice];

    if (hasSearchFilter) {
      filteredGruop = filteredGruop.filter((data) =>
        data.imeI_Name.toLowerCase().includes(filterValue.toLowerCase()) ||
        data.gatewayId.toLowerCase().includes(filterValue.toLowerCase()) ||
        data.streetLightSerial.toLowerCase().includes(filterValue.toLowerCase()) ||
        data.streetLightName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGruop;
  }, [listDevice, filterValue, statusFilter , listGroup]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ListDeviceInGroup, b: ListDeviceInGroup) => {
      const first = a[sortDescriptor.column as keyof ListDeviceInGroup] as string;
      const second = b[sortDescriptor.column as keyof ListDeviceInGroup] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  

  const renderCell = React.useCallback(
    
    (deviceAll: ListDeviceInGroup, columnKey: React.Key) => {
        
      const cellValue = deviceAll[columnKey as keyof ListDeviceInGroup];

      switch (columnKey) {
        case "streetLightName":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {cellValue === "ไม่มีข้อมูล" ? "ไม่มีข้อมูล" : cellValue}
              </p>
              <p className="text-bold text-sm capitalize text-default-400">
                {deviceAll.imeI_Name}
              </p>
            </div>
          );

        case "streetLightGroups":
          var ff : any = cellValue;
          ff.forEach((element : any) => {
            
          });
          return (
            <div className="flex flex-col">
              
              <p className="text-bold text-sm capitalize">
                {cellValue}
              </p>
             
            </div>
          );

        case "command":
          return (
            <div
              className="flex items-center gap-10"
              style={{ placeSelf: "center" }}
            >
              <ButtonModelIndividualCommand
                deviceId={deviceAll.imeI_Name}
              ></ButtonModelIndividualCommand>
            </div>
          );
        case "data":
          return (
            <div
              className="flex items-center gap-10"
              style={{ placeSelf: "center" }}
            >
              <ButtonModelListIndividualLog
                deviceId={deviceAll.imeI_Name}
              ></ButtonModelListIndividualLog>
            </div>
          );
        case "working":
          return (
            <div className="flex items-center" style={{ placeSelf: "center" }}>
              <ButtonModelListIndividualWorking
                deviceId={deviceAll.imeI_Name}
              ></ButtonModelListIndividualWorking>
            </div>
          );
        case "mode":
          return (
            <div
              className="flex items-center gap-10"
              style={{ placeSelf: "center" }}
            >
              <ButtonModelListIndividualWorking
                deviceId={deviceAll.imeI_Name}
              ></ButtonModelListIndividualWorking>
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

  const handleInputChange = async (newValue: string) => {
    //setdataSearchGroup(newValue); 
    onListDevice(newValue)
    //console.log(newValue)
    //setFilterValue(newValue);
  };

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Autocomplete
            size="sm"
            label={t(`search-imsi`)}
            placeholder={t(`select-imsi`)}
            //className="max-w-xs"
            value={dataSearchGroup}
            onInputChange={handleInputChange}
          >
            {listGroup.map((data: any) => (
              <AutocompleteItem key={data.group_code}>
                {data.group_name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Input
            isClearable
            className="w-full sm:max-w-[50%]"
            placeholder={t(`search-by-group`)}
            startContent={<Search />}
            value={filterValue}
            size="lg"
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3"></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-group`)} {listDevice.length}
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
    listDevice.length,
    listGroup,
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
        <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">

          <Table
            isStriped
            layout="auto"
            //fullWidth={false}
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
                  minWidth={100}
                  key={column.uid}
                  align={column.align === "start" ? "start" : "center"}
                  allowsSorting={column.sortable}

                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={t(`no-group-found`)} items={sortedItems}>
              {(item) => (
                <TableRow key={item.imeI_Name} >
                  {(columnKey) => (
                    <TableCell >{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          
        </Skeleton>
      </CardBody>
    </Card>
  );
};

export default TableListDevice;