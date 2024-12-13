"use client";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
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
  Snippet,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Search} from "lucide-react";

import { ListDevice, ListImsi } from "@/app/interface/control";
import ButtonConfrim from "./button/btn-group-confirm";
import { useTranslations } from "next-intl";
import ButtonConfirmEdit from "./button/btn-group-confirm-edit";

const INITIAL_VISIBLE_COLUMNS = [
  "street_light_name",
  "gov_name",
  "lat",
  "long",
  "imsi",
  "last_update",
  "last_power",
  "status",
  "actions",
];

interface TableProps {
  groupName : string
  groupCode : string
  listDevice: ListDevice[];
  onDeleteImsiInGroup : (dataGroupName: string, dataGroupCode: string, dataImsi : string) => Promise<ListDevice[]>;
  onSaveDataDevice : (dataGroupName : string ,imsi : string , latLamp : string, longLamp : string , namePole : string , nameGov : string) => Promise<ListDevice[]>;
  onAddImsiGroup : (dataGroupName: string, dataGroupCode: string, dataImsi : string) => Promise<ListDevice[]>;
  onDataImsiAll : ListImsi[];

}

const TableImsiGroup: FC<TableProps> = ({ groupName ,groupCode ,listDevice, onDeleteImsiInGroup, onDataImsiAll, onAddImsiGroup ,onSaveDataDevice }) => {
  const t = useTranslations("ControlGroup");
  const [filterValue, setFilterValue] = useState("");
  const [getListDevice, setListDevice] = useState(listDevice);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isAddDeviceLoading, setAddDeviceLoading] = useState(false);

  const [dataSearchImsi, setDataSearchImsi] = useState<string>("ALL");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "street_light_name",
    direction: "ascending",
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const [page, setPage] = useState(1);
  var [isLoaded, setIsLoaded] = useState(true);

  const columns = [
    { name: t(`street-light-name`), uid: "street_light_name", sortable: true },
    { name: t(`gov`), uid: "gov_name", sortable: true },
    { name: t(`lat`), uid: "lat", sortable: false },
    { name: t(`long`), uid: "long", sortable: false },
    { name: t(`imsi`), uid: "imsi", sortable: false },
    { name: t(`actions`), uid: "actions" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredGruop = [...getListDevice];

    if (hasSearchFilter) {
      filteredGruop = filteredGruop.filter(
        (data) =>
          data.street_light_name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          data.imsi.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGruop;
  }, [getListDevice, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: ListDevice, b: ListDevice) => {
      const first = a[sortDescriptor.column as keyof ListDevice] as string;
      const second = b[
        sortDescriptor.column as keyof ListDevice
      ] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const renderCell = useCallback(
    
    (listDevice: ListDevice, columnKey: React.Key) => {
      const cellValue = listDevice[columnKey as keyof ListDevice];
      //setIsLoaded(true);
      if (columnKey == "status") {
        //console.log(cellValue)
      }

      switch (columnKey) {
        case "street_light_name":
          return (
            <div className="flex flex-col">
              <Input
                id={"street_light_name_" + listDevice.imsi}
                label=""
                variant="underlined"
                placeholder={cellValue}
                labelPlacement="outside-left"
                type="text"
                defaultValue={cellValue}
                className="max-w-xs"
              />
            </div>
          );

        case "gov_name":
          return (
            <div className="flex flex-col max-w-80">
              <Input
                id={"gov_name_" + listDevice.imsi}
                label=""
                variant="underlined"
                placeholder={cellValue}
                labelPlacement="outside-left"
                type="text"
                defaultValue={cellValue}
                className="max-w-80"
              />
            </div>
          );

          case "lat":
            return (
              <div className="flex flex-col">
                <Input
                  id={"lat_" + listDevice.imsi}
                  label=""
                  variant="underlined"
                  placeholder={cellValue}
                  labelPlacement="outside-left"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={cellValue}
                  className="max-w-xs"
                />
              </div>
            );
        
            case "long":
          return (
            <div className="flex flex-col">
              <Input
               id={"long_" + listDevice.imsi}
                label=""
                variant="underlined"
                placeholder={cellValue}
                labelPlacement="outside-left"
                type="number"
                min={0}
                step={0.01}
                defaultValue={cellValue}
                className="max-w-xs"
              />
            </div>
          );

        case "imsi":
          return (
            <div className="flex flex-col">
              <Snippet 
                id={"imsi_"+ listDevice.imsi}
                tooltipProps={{ color: "foreground", content: t(`copy`) , placement: "top", closeDelay: 0}} 
                hideSymbol={true} size="lg" radius="none">
                {cellValue}
              </Snippet>
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
              
              <ButtonConfirmEdit value={listDevice.imsi} onConfirm={handleConfirmationEdit} onClick={handleClick}></ButtonConfirmEdit>
              {/* {groupName === "ALL" ? "" : <ButtonConfrim  onClick={handleClick} value={listDevice.imsi} onConfirm={handleConfirmation}></ButtonConfrim>} */}
              <ButtonConfrim  onClick={handleClick} value={listDevice.imsi} onConfirm={handleConfirmation}></ButtonConfrim>
              
            </div>
          );

        default:
          return <p className="text-bold text-sm capitalize">{cellValue}</p>;
      }
    },
    []
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );


  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const handleInputChange = async (newValue: string) => {
    setDataSearchImsi(newValue); 
    setFilterValue(newValue);
  };

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleSelectionChange = useCallback(
    (newSelection: any) => {
      setSelectedKeys(newSelection);
    },
    
    [selectedKeys]
  );

  var handleSend = useCallback(async () => {
    setAddDeviceLoading(true)
    var dataListDevice = await onAddImsiGroup(groupName, groupCode, dataSearchImsi);
    setListDevice(dataListDevice)
    listDevice = dataListDevice
    onClear()
    if(dataListDevice.length >= 0){
      setAddDeviceLoading(false)      
    }
    //console.log(dataListDevice)
  }, [getListDevice, listDevice , dataSearchImsi, isAddDeviceLoading])

  const handleConfirmation = (confirmed: boolean, value : string) => {
    setIsConfirmed(confirmed);
    handleDelete(value)

  };

  const handleClick = (click: boolean) => {
    if (click) {
      
    } else {
      
    }
  };

  const handleConfirmationEdit = useCallback (async (confirmed: boolean, value : string) => {

    let street_light_name = (document.getElementById("street_light_name_"+ value) as HTMLInputElement).value;
    let gov = (document.getElementById("gov_name_"+ value) as HTMLInputElement).value;
    let lat = (document.getElementById("lat_"+ value) as HTMLInputElement).value;
    let long = (document.getElementById("long_"+ value) as HTMLInputElement).value;

    var listData = await onSaveDataDevice(groupName, value, lat, long, street_light_name , gov);
   
    setListDevice(listData)
    listDevice = listData
    
    return true

  },[getListDevice, listDevice]);

  const handleDelete = useCallback(async (imsi : string) => {
    var listData = await onDeleteImsiInGroup(groupName, groupCode, imsi);
    setListDevice(listData)
    listDevice = listData
    onClear()
  }, [getListDevice, listDevice])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-2">
        <div >
          <Card className="col-span-12">
            <CardBody className="grid grid-cols-12 gap-10">
              <div className="col-span-12 md:col-span-5">
                <Autocomplete
                
                  label={t(`search-imsi`)}
                  placeholder={t(`select-imsi`)}
                  //className="max-w-xs"
                  value={dataSearchImsi}
                  onInputChange={handleInputChange}
                >
                  {onDataImsiAll.map((data: any) => (
                    <AutocompleteItem key={data.key}>
                      {data.value}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="col-span-6 md:col-span-2 self-center">
             
                {groupName === "ALL" ? "" : <Button 
                  aria-label="add imsi"
                  size="md" 
                  isLoading={isAddDeviceLoading}
                  className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15" 
                  onClick={() => handleSend()}>
                  {t(`add-imsi`)}
                  <Icon icon="lucide:plus" width="auto" height="auto" />
                </Button>
                }
                
                

              </div>

              <div className="col-span-6 md:col-span-5 self-center">
                <Input
                  isClearable
                  className="w-full sm:max-w-[100%]"
                  placeholder={t(`search-by-name-imsi`)}
                  startContent={<Search />}
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-device`)} {getListDevice.length}
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
    getListDevice.length,
    hasSearchFilter,
    handleSelectionChange,
    handleSend,
  ]);

  const bottomContent = useMemo(() => {
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
  }, [
    selectedKeys,
    items.length,
    page,
    pages,
    hasSearchFilter,
    handleSelectionChange,
    handleSend,
  ]);

  return (
    <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
      <Table
        isStriped
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "h-[calc(100vh-490px)]",
        }}
        selectedKeys={selectedKeys}
        //selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={handleSelectionChange}
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
        <TableBody emptyContent={t(`no-device-found`)} items={sortedItems}>
          {(item) => (
            <TableRow key={item.imsi}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
    </Skeleton>
  );
};

export default TableImsiGroup;
