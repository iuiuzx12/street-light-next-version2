"use client";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
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
  Autocomplete,
  AutocompleteItem,
  ButtonGroup,
} from "@heroui/react";
import { MailIcon, Search, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { ListLogDevice, ListLogDeviceNotAverage } from "@/app/interface/individual";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "ts",
  "da",
  "date",
  "time",
  "v",
  "i",
  "pf",
  "w",
];

interface TableProps {
    deviceId : string;
    listLogDevice : ListLogDevice;
    onListLogDevice: (deviceId: string , day : string) => Promise<ListLogDevice>;
}

const TableIndividualLog: FC<TableProps> = ({ listLogDevice , onListLogDevice ,deviceId }) => {
  const t = useTranslations("ControlIndividual");
  const [filterValue, setFilterValue] = useState("");
  const [dataListLogDevice, setListLogDevice] = useState<ListLogDevice>(listLogDevice);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tsDD",
    direction: "descending",
  });

  const [page, setPage] = useState(1);

  const columns = [
    { name: t(`no`) , uid: "id", sortable: true },
    { name: t(`date-time`) , uid: "date", sortable: true },
    { name: t(`w`), uid: "w", sortable: true },
    { name: t(`v`) , uid: "v", sortable: false },
    { name: t(`i`), uid: "i", sortable: true },
    { name: t(`pf`), uid: "pf", sortable: true },
  ];

  
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredGruop = [...dataListLogDevice.data];

    if (hasSearchFilter) {
      filteredGruop = filteredGruop.filter(
        (data) =>
          data.pf.toLowerCase() .includes(filterValue.toLowerCase()) || 
            data.v.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredGruop;
  }, [dataListLogDevice, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: ListLogDeviceNotAverage, b: ListLogDeviceNotAverage) => {
      const first = a[sortDescriptor.column as keyof ListLogDeviceNotAverage] as string;
      const second = b[
        sortDescriptor.column as keyof ListLogDeviceNotAverage
      ] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (listDevice: ListLogDeviceNotAverage, columnKey: React.Key) => {
      const cellValue = listDevice[columnKey as keyof ListLogDeviceNotAverage];
     
      switch (columnKey) {

        case "date":
          return (
            <div className="min-w-40">
              {listDevice.date}  {listDevice.time}
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

  const handleInputChange = async (newValue: Key | null) => {
    
    if(newValue !== null){
        let dataDay : string = newValue.toString();
        let dataListLogDevice = await onListLogDevice(deviceId, dataDay);
        setListLogDevice(dataListLogDevice)
    }
  };

  const topContent = useMemo(() => {
    return (
      <div>
        <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 grid-rows-5 md:grid-rows-2 gap-2 m-1">
              <Autocomplete
                className="md:col-span-2"
                size="sm"
                label={t(`search-day`)}
                placeholder={t(`select-day`)}
                value={"1"}
                onSelectionChange={handleInputChange}
              >
                <AutocompleteItem key={"1"}>{"1 "+ t(`day`)}</AutocompleteItem>
                <AutocompleteItem key={"3"}>{"3 "+ t(`day`)}</AutocompleteItem>
                <AutocompleteItem key={"7"}>{"7 "+ t(`day`)}</AutocompleteItem>
                <AutocompleteItem key={"15"}>{"15 "+ t(`day`)}</AutocompleteItem>
                <AutocompleteItem key={"30"}>{"30 "+ t(`day`)}</AutocompleteItem>
              </Autocomplete>

              <Input
                  isClearable
                  size="lg"
                  className="w-full self-center"
                  placeholder={t(`search-by-v-w-i-pf`)}
                  startContent={<Search />}
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
                />

              <ButtonGroup isDisabled>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">{t(`avg-volt`)}</Button>
                <Button size="sm" className="bg-gradient-to-tr from-blue-200 to-blue-100 text-black shadow-lg ">{dataListLogDevice.averageVolt}</Button>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">V</Button>
              </ButtonGroup>

              <ButtonGroup isDisabled>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">{t(`avg-watt`)}</Button>
                <Button size="sm" className="bg-gradient-to-tr from-blue-200 to-blue-100 text-black shadow-lg ">{dataListLogDevice.averageWatt}</Button>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">W</Button>
              </ButtonGroup>

              <ButtonGroup isDisabled>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">{t(`avg-i`)}</Button>
                <Button size="sm" className="bg-gradient-to-tr from-blue-200 to-blue-100 text-black shadow-lg ">{dataListLogDevice.averageI}</Button>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg ">mA</Button>
              </ButtonGroup>
              
            
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-logs`)} {dataListLogDevice.data.length}
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
    dataListLogDevice.data.length,
    hasSearchFilter,
    handleSelectionChange,
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
    //handleSend,
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
          <TableBody emptyContent={t(`logs-not-found`)} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id}>
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

export default TableIndividualLog;
