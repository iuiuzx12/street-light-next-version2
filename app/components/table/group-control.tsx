"use client";
import React, { FC, useCallback, useMemo, useState } from "react";
import { RefreshCcw, CircleArrowLeft } from "lucide-react";
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
  Snippet,
  Slider,
  Progress,
} from "@nextui-org/react";
import { Search, SendIcon } from "lucide-react";
import { ListDevice } from "@/app/interface/control";
import { ListLatLong } from "@/app/interface/map";
import StaticMapXYZComponent from "../map/map-xyz";
import { useTranslations } from "next-intl";

const INITIAL_VISIBLE_COLUMNS = [
  "street_light_name",
  "gov_name",
  "imsi",
  "last_update",
  "last_power",
  "status",
  "actions",
];

interface TableProps {
  groupName: string;
  groupCode: string;
  listDevice: ListDevice[];
  onReloadLatLong : (typeSearch : string, dataSearch : string) => Promise<ListLatLong[]>;
  onSendCommand: (
    typeOpen: string,
    value: string,
    commandType: string,
    dimPercent: string
  ) => Promise<ListLatLong[]>;
}

const TableControlGroup: FC<TableProps> = ({
  groupName,
  groupCode,
  listDevice,
  onReloadLatLong,
  onSendCommand,
}) => {
  const t = useTranslations("ControlGroup");
  const [filterValue, setFilterValue] = useState("");
  const [getListDevice, setListDevice] = useState(listDevice);
  const [selectedKeys, setSelectedKeys] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disCommand, setDisCommand] = useState(listDevice.length == 0 ?true : false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "street_light_name",
    direction: "ascending",
  });

  const [data, setData] = useState<Array<ListLatLong>>([]);

  const [page, setPage] = useState(1);
  var [isLoaded, setIsLoaded] = useState(true);
  var [isOpenLight, setIsOpenLight] = useState(false);
  var [isValueSlider, setValueSlider] = useState<number | number[] | undefined>(80);

  const [isResponse, setResponse] = useState(0);
  const [isNotResponse, setNotResponse] = useState(0);

  const columns = [
    { name: t(`street-light-name`) , uid: "street_light_name", sortable: true },
    { name: t(`gov`), uid: "gov_name", sortable: true },
    { name: t(`imsi`) , uid: "imsi", sortable: false },
    { name: t(`last-command`), uid: "last_command", sortable: true },
    { name: t(`last-update`), uid: "last_update", sortable: true },
    { name: t(`last-power`), uid: "last_power", sortable: true },
    { name: t(`status`), uid: "status", sortable: false },
  ];

  const icons: { [key: number]: string } = {
    0: "/icon/lamp/lamp-gray-a.png",
    1: "/icon/lamp/lamp-gray-m.png",
    2: "/icon/lamp/lamp-gray-e.png",
    3: "/icon/lamp/lamp-gray-dis.png",
    4: "/icon/lamp/lamp-green-a.png",
    5: "/icon/lamp/lamp-green-m.png",
    6: "/icon/lamp/lamp-green-e.png",
    7: "/icon/lamp/lamp-green-dis.png",
    8: "/icon/lamp/lamp-yellow.png",
    9: "/icon/lamp/lamp-blue-a.png",
    10: "/icon/lamp/lamp-red-dis24.png",
  };

  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setSeconds(0);
    setIsRunning(true);
    setData([]);
    const id = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
    console.log(id);
    return id;
  }, [intervalId, isRunning]);

  const stopTimer = useCallback(
    (id: NodeJS.Timeout) => {
      if (id) {
        clearInterval(id);
        setIsRunning(false);
      }
    },
    [intervalId, isRunning]
  );

  const resetTimer = (id: NodeJS.Timeout) => {
    if (id) {
      clearInterval(id);
    }
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const responseControl = (data : ListLatLong[]) => {
    var open = 0;
    var close = 0;
    data.forEach(function(element, index, array){
        
        if(element.status === "1"){
          open += 1;
        } else if (element.status === "0"){
          close +=1
        }else{
          close +=1
        }
    });
    setResponse(open)
    setNotResponse(close)
    //console.log(open);
    //console.log(close);
  };

  const onReloadDataLatLong = useCallback(async () => {
    const entriesArray = Array.from(selectedKeys);
    if (
      entriesArray[0] === "a" &&
      entriesArray[1] === "l" &&
      entriesArray[2] === "l"
    ) {
      const result = await onReloadLatLong(
        "group",
        JSON.stringify([groupCode])
        
      );
      if (result) {
        setData(result);
        responseControl(result)
      }
    } else {
      let result = await onReloadLatLong(
        "imsi",
        JSON.stringify(entriesArray),
      );
      
      if (result) {
        setData(result);
        responseControl(result)
      }
    }
    
  }, [selectedKeys]);

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
      if (columnKey == "status") {
      }

      switch (columnKey) {
        case "street_light_name":
          return (
            <div className="flex flex-col">
              <Snippet 
                tooltipProps={{ color: "foreground", content: t(`copy`) , placement: "top", closeDelay: 0}} 
                hideSymbol={true} size="lg" radius="none">
                {cellValue}
              </Snippet>
            </div>
          );

        case "imsi":
          return (
            <div className="flex flex-col">
              <Snippet 
              tooltipProps={{ color: "foreground", content: t(`copy`) , placement: "top", closeDelay: 0}} 
                hideSymbol={true} size="lg" radius="none">
                {cellValue}
              </Snippet>
            </div>
          );

        case "status":
          return (
            <div className="flex flex-col">
              <img src={icons[Number(cellValue)]} width={30} height={30}></img>
            </div>
          );

        default:
          //setIsLoaded(true);
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

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleSelectionChange = useCallback(
    (newSelection: any) => {
      setSelectedKeys(newSelection);
      if(newSelection.size == 0){
        setDisCommand(true)
      }
      else{
        setDisCommand(false)
      }
    },

    [selectedKeys ,disCommand]
  );

  var handleSlider = (value: number | number[]) => {
    setValueSlider(value);
  };

  var handleSend = useCallback(async () => {
    setSelectedKeys(selectedKeys);
    setIsOpenLight(true);
    const id_time = startTimer();
    setIntervalId(id_time);
    const dim = isValueSlider === 0 ? 1 : isValueSlider!;
    const command = isValueSlider === 0 ? 0 : 1;

    const entriesArray = Array.from(selectedKeys);
    console.log(entriesArray)
    if (
      entriesArray[0] === "a" &&
      entriesArray[1] === "l" &&
      entriesArray[2] === "l"
    ) {
      const result = await onSendCommand(
        "group",
        JSON.stringify([groupCode]),
        command.toString(),
        dim?.toString()
      );
      if (result) {
        setData(result);
        responseControl(result)
        stopTimer(id_time);
      }
    } else if (entriesArray.length === 0){
      
      const result = await onSendCommand(
        "group",
        JSON.stringify([groupCode]),
        command.toString(),
        dim?.toString()
      );
      if (result) {
        setData(result);
        responseControl(result)
        stopTimer(id_time);
      }

    }
    else {
      let result = await onSendCommand(
        "multi_imsi",
        JSON.stringify(entriesArray),
        command.toString(),
        dim?.toString()
      );
      
      if (result) {
        setData(result);
        responseControl(result)
        stopTimer(id_time);
      }
    }
  }, [selectedKeys, isValueSlider, intervalId, isRunning]);

  const handleBack = useCallback(() => {
    setValueSlider(isValueSlider);
    setIsOpenLight(false);
  }, [selectedKeys, isValueSlider]);

  const topContent = useMemo(() => {
    return (
      <div>
        <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-5 grid-rows-3 md:grid-rows-1 gap-2 m-2">
          <Slider
            className="col-span-2"
            size="md" 
            label={t(`select-brightness`)}
            defaultValue={isValueSlider}
            onChange={handleSlider}
            classNames={{
              base: "max-w-md gap-3",
              track: "border-s-secondary-100",
              filler: "bg-gradient-to-r from-secondary-100 to-secondary-600",
            }}
            renderThumb={(props) => (
              <div
                {...props}
                className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
              >
                <span className="transition-transform bg-gradient-to-br shadow-small from-secondary-100 to-secondary-600 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
              </div>
            )}
          />

          <Button
            aria-label="send"
            isDisabled={disCommand}
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15 self-center"
            size="lg"
            onClick={() => handleSend()}
          >
            <h1>{t(`send`)}</h1>
            <SendIcon> </SendIcon>
          </Button>
          <Input
          size="lg"
            isClearable
            className="w-full col-span-2 self-center"
            placeholder={t(`search-by-name-imsi`)}
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
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
      {isOpenLight === false ? (
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
          selectionMode="multiple"
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
      ) : (
        <div>
          <Progress
            aria-label="progress control"
            size="sm"
            isIndeterminate={isRunning}
            className="max-w-full bg-gradient-to-tr from-blue-400 to-blue-200 text-white shadow-lg"
          />

          <table aria-label="table response" className="border-separate border-spacing-2 border border-slate-200 w-full">
            <thead>
              <tr>
                <th className="border border-violet-200">
                  {t(`successes`)} : {isResponse} {t(`lamp`)}
                </th>
                <th className="border border-violet-200">
                  {t(`unsuccessful`)}  : {isNotResponse} {t(`lamp`)}
                </th>
                <th >
                  <Button
                    onClick={onReloadDataLatLong}
                    size="md"
                    aria-label="refresh"
                    className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg w-full"
                  >
                    <RefreshCcw width="25px" height="25px" />
                  </Button>
                </th>
              </tr>
            </thead>
          </table>

          <table aria-label="table control" className="border-separate border-spacing-2 border border-slate-200 w-full">
            <thead>
              <tr>
                <th className="border border-violet-200">{t(`group`)}</th>
                <th className="border border-violet-200">{t(`command`)}</th>
                <th className="border border-violet-200">{t(`lux`)}</th>
                <th className="border border-violet-200">{t(`time`)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-violet-200 text-center">{groupName}</td>
                <td className="border border-violet-200 text-center">{isValueSlider === 0 ? t(`turn-off`) : t(`turn-on`)}</td>
                <td className="border border-violet-200 text-center">{isValueSlider}</td>
                <td className="border border-violet-200 text-center">
                  {formatTime(seconds)}
                </td>
              </tr>
            </tbody>
          </table>

          <StaticMapXYZComponent
            high="h-[calc(100vh-490px)]"
            data={data}
          ></StaticMapXYZComponent>
          <Button
            aria-label="back"
            className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
            onClick={handleBack}
          >
            <CircleArrowLeft aria-label="img back" width="25px" height="25px" />
          </Button>
        </div>
      )}
    </Skeleton>
  );
};

export default TableControlGroup;
