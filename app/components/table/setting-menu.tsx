"use client";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
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
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
  Progress,
  Switch,
} from "@heroui/react";
import {
  Check,
  MousePointerClick,
  Power,
  PowerOff,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { RuleUserItem } from "@/app/model/rule";
import { ListAuthMenu } from "@/app/interface/auth";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "menu_id",
  "menu_name",
  "readable",
  "writeable",
  "control",
];

interface TableProps {
  rule: RuleUserItem;
  listAuthMenu: ListAuthMenu[];
  loading: boolean;
  onSetting: (roleId: string, value: string) => void;
  onChangeRole: (roleId: string) => Promise<ListAuthMenu[]>;
}

const TableSettingMenu: React.FC<TableProps> = ({
  rule,
  listAuthMenu,
  loading,
  onSetting,
  onChangeRole,
}) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "menu_name",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const t = useTranslations("SettingMenu");
  const [RuleId, setRuleId] = useState<string>("1");

  const columns = [
    {
      name: t(`menu-name`),
      uid: "menu_name",
      sortable: true,
      align: "start",
    },
    { name: t(`show-menu`), uid: "readable", sortable: false, align: "center" },
    { name: t(`config`), uid: "writeable", sortable: false, align: "center" },
    { name: t(`control`), uid: "control", sortable: false, align: "center" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...listAuthMenu];

    if (hasSearchFilter) {
      filtered = filtered.filter(
        (data) =>
          data.menu_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          data.menu_id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [listAuthMenu, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ListAuthMenu, b: ListAuthMenu) => {
      const first = a[sortDescriptor.column as keyof ListAuthMenu] as string;
      const second = b[sortDescriptor.column as keyof ListAuthMenu] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (
      listAuthMenu: ListAuthMenu,
      columnKey: React.Key,
      dataRule: RuleUserItem,
      id : string
    ) => {
      const cellValue = listAuthMenu[columnKey as keyof ListAuthMenu];
      switch (columnKey) {
        case "menu_name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {cellValue}
              </p>
            </div>
          );

        case "readable":
          return (
            <Switch
              isSelected={listAuthMenu.readable === "1" ? true : false}
              isDisabled={!dataRule.config}
              onChange={ () => handleSetting(id, listAuthMenu.menu_id , listAuthMenu.readable == "0" ? "1" : "0" , listAuthMenu.writeable , listAuthMenu.control)}
              color="success"
              size="md"
              thumbIcon={
                listAuthMenu.readable === "1" ? (
                  <Check color="gray" />
                ) : (
                  <X color="gray" />
                )
              }
            ></Switch>
          );

          case "writeable":
            return (
              <Switch
                isSelected={listAuthMenu.writeable === "1" ? true : false}
                isDisabled={!dataRule.config}
                onChange={ () => handleSetting(id, listAuthMenu.menu_id , listAuthMenu.readable , listAuthMenu.writeable  == "0" ? "1" : "0" , listAuthMenu.control)}
                color="success"
                size="md"
                thumbIcon={
                  listAuthMenu.writeable === "1" ? (
                    <Check color="gray" />
                  ) : (
                    <X color="gray" />
                  )
                }
              ></Switch>
            );

            case "control":
            return (
              <Switch
                isSelected={listAuthMenu.control === "1" ? true : false}
                isDisabled={!dataRule.config}
                onChange={ () => handleSetting(id, listAuthMenu.menu_id , listAuthMenu.readable , listAuthMenu.writeable , listAuthMenu.control == "0" ? "1" : "0")}
                color="success"
                size="md"
                thumbIcon={
                  listAuthMenu.control === "1" ? (
                    <Check color="gray" />
                  ) : (
                    <X color="gray" />
                  )
                }
              ></Switch>
            );

        default:
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

  const handleInputChange = useCallback ( async (newValue: Key | null) => {
    if (newValue !== null) {
      let data: string = newValue.toString();
      onChangeRole(data);
      setRuleId(data);
    }

  } , [RuleId]);

  const handleSetting = useCallback( async ( id : string, menuId : string , r : string , w : string , c : string) => {
    let data = [{
        menu_id : menuId,
        readable : r,
        writeable : w,
        control : c
    }]
    onSetting(id, JSON.stringify(data));
  }, [RuleId]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3">
          <Autocomplete
            size="md"
            placeholder={t(`select-role`)}
            aria-label="select-role"
            defaultSelectedKey={"1"}
            onSelectionChange={handleInputChange}
          >
            <AutocompleteItem key={"1"}>{t(`admin-management`)}</AutocompleteItem>
            <AutocompleteItem key={"2"}>{t(`management`)}</AutocompleteItem>
            <AutocompleteItem key={"3"}>{t(`operator`)}</AutocompleteItem>
            <AutocompleteItem key={"4"}>{t(`admin`)}</AutocompleteItem>
            <AutocompleteItem key={"5"}>{t(`privilege`)}</AutocompleteItem>
          </Autocomplete>

          <Input
            isClearable
            className="w-full sm:max-w-[50%]"
            placeholder={t(`search-by-name-menu`)}
            startContent={<Search />}
            value={filterValue}
            size="md"
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3"></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t(`total-menu`)} {listAuthMenu.length}
          </span>
          <label className="flex items-center text-default-400 text-small">
            {t(`rows-per-page`)}
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="20">20</option>
              <option value="15">15</option>
              <option value="10">10</option>
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
    listAuthMenu.length,
    listAuthMenu,
    hasSearchFilter,
    RuleId
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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter ,RuleId]);

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
                loadingContent={
                  <Progress
                    isIndeterminate
                    aria-label="Loading..."
                    className="w-full mt-auto"
                    size="sm"
                  />
                }
                emptyContent={t(`menu-not-found`)}
                items={sortedItems}
              >
                {(item) => (
                  <TableRow key={item.menu_id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey, rule, RuleId)}</TableCell>
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

export default TableSettingMenu;
