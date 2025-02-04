import React, { Key, useCallback, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  CheckboxGroup,
  Checkbox,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  AutocompleteItem,
  Slider,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Plus, Edit, Delete, Group, X } from "lucide-react";
import { ListSchedule, SaveSchedule } from "@/app/interface/schedule";
import { ListGroupAll } from "@/app/interface/control";
interface Props {
  disabled: boolean;
  type: string;
  dataDetail: ListSchedule | null;
  dataListGroup: () => Promise<ListGroupAll[]>;
  onSaveData: (data: SaveSchedule) => void;
}

const ButtonModelEditAddSchedule: React.FC<Props> = ({
  disabled,
  type,
  dataDetail,
  dataListGroup,
  onSaveData,
}) => {
  const [listGroup, setListGroup] = useState<{ name: string; code: string }[]>(
    []
  );
  const t = useTranslations("ControlSchedule");
  const handleOpenEdit = async () => {
    const getDataListGroup = await dataListGroup();
    const listGroup = (getDataListGroup ?? []).map((data, index) => ({
      name: data.group_name,
      code: data.group_code,
    }));
    setListGroup(listGroup);
    onOpen();
  };

  const listType = [
    { code: "time", name: t(`time`) },
    { code: "light", name: t(`light`) },
    { code: "manual", name: t(`manual`) },
  ];

  type Time = {
    key: string;
    time: string;
    dim: string;
  };

  type Daylight = {
    key: string;
    command: string;
    lux: string;
    percent: string;
  };

  type Group = {
    code: string;
    name: string;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [selectedDay, setSelectedDay] = React.useState(
    dataDetail?.listDays ?? ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  );
  const [nameSchedule, setNameSchedule] = React.useState(
    dataDetail?.scheduleName ?? ""
  );
  const [rowsNull, setRowsNull] = useState<Array<any>>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [selectedType, setSelectedType] = useState(
    dataDetail?.typeSchedule ?? ""
  );
  const [codeName, setCodeName] = useState(dataDetail?.groupCode ?? "new");
  const [rowsGroup, setRowsGroup] = useState<Array<Group>>(
    (dataDetail?.dataGroupCode ?? []).map((code, index) => ({
      code: code,
      name: dataDetail?.dataGroupName[index] || "",
    }))
  );
  const [rowsTime, setRowsTime] = useState<Array<Time>>(
    (dataDetail?.listScenes ?? []).map((scene: any, index) => ({
      key: (index + 1).toString(),
      time: scene.time,
      dim: scene.dim,
    }))
  );
  const [rowsDaylight, setRowsDaylight] = useState<Array<Daylight>>(
    dataDetail?.listScenes && dataDetail.listScenes.length > 0
      ? [
          {
            key: "1",
            command: "open",
            lux: dataDetail?.listScenes[0].open_volt,
            percent: dataDetail?.listScenes[0].open_time,
          },
          {
            key: "2",
            command: "close",
            lux: dataDetail?.listScenes[0].close_volt,
            percent: dataDetail?.listScenes[0].close_time,
          },
        ]
      : [
          {
            key: "1",
            command: "open",
            lux: "300",
            percent: "100",
          },
          {
            key: "2",
            command: "close",
            lux: "3900",
            percent: "0",
          },
        ]
  );

  const isFormValid = useCallback(() => {
    switch (selectedType) {
      case "time":
        return (
          nameSchedule == "" ||
          selectedDay.length == 0 ||
          rowsTime.length == 0 ||
          rowsGroup.length == 0 || 
          disabled == false
        );

      case "light":
        return (
          nameSchedule == "" || selectedDay.length == 0 || rowsGroup.length == 0 || disabled == false
        );

      case "manual":
        return (
          nameSchedule == "" || selectedDay.length == 0 || rowsGroup.length == 0 || disabled == false
        );

      default:
        return true;
    }
  }, [selectedType, nameSchedule, rowsTime, rowsGroup, selectedDay]);

  const handleInputGroupChange = useCallback(
    async (newValue: Key | null) => {
      if (newValue !== null) {
        let code: string = newValue.toString();
        let found = listGroup.find((element) => element.code == code);
        if (rowsGroup.find((element) => element.code == code)) {
          return false;
        }
        let rowsGroupNew = {
          code: found?.code == null ? "" : found?.code,
          name: found?.name == null ? "" : found?.name,
        };

        setRowsGroup((prevRows) => [...prevRows, rowsGroupNew]);
      }
    },
    [rowsGroup, listGroup, dataListGroup]
  );

  const handleAddTime = useCallback(async () => {
    if (rowsTime.length > 11) {
      return false;
    }
    const newRowTime = {
      key: Math.random().toString(),
      time: "00:00",
      dim: "0",
    };

    setRowsTime((prevRows) => [...prevRows, newRowTime]);
  }, [rowsTime]);

  const handleChangeTime = useCallback(
    (key: string, value: string) => {
      const index = rowsTime.findIndex((item) => item["key"] === key);
      rowsTime[index] = { ...rowsTime[index], ["time"]: value };
      setRowsTime(rowsTime);
    },
    [rowsTime]
  );

  const handleChangeDim = useCallback(
    (key: string, value: number | number[]) => {
      const updatedDim = rowsTime.map((item) =>
        item.key === key ? { ...item, dim: value.toString() } : item
      );
      setRowsTime(updatedDim);
    },
    [rowsTime]
  );

  const handleChangeDimSetDaylight = useCallback(
    (key: string, command: string, value: any) => {
      const updatedDim = rowsDaylight.map((item) =>
        item.key === key && item.command === command
          ? { ...item, percent: value.toString() }
          : item
      );
      setRowsDaylight(updatedDim);
    },
    [rowsDaylight]
  );

  const handleChangeLuxSetDaylight = useCallback(
    (key: string, command: string, value: any) => {
      const updatedDim = rowsDaylight.map((item) =>
        item.key === key && item.command === command
          ? { ...item, lux: value.toString() }
          : item
      );
      setRowsDaylight(updatedDim);
    },
    [rowsDaylight]
  );

  const handleSave = useCallback(async () => {
    setLoading(true);
    //console.log(rowsGroup);
    //console.log(rowsTime);
    //console.log(rowsDaylight);
    //console.log(selectedDay);
    //console.log(nameSchedule);
    //console.log(selectedType);

    const resultGroupNameCode = rowsGroup.map(
      (item) => `${item.name.trim()}$${item.code}`
    );
    const resultTime = rowsTime.map(({ key, ...rest }) => rest);
    //open_volt = lux
    //open_time = dim
    const transformedDataDayLight = {
      open_volt:
        rowsDaylight.find((item) => item.command === "open")?.lux ?? "0",
      open_time:
        rowsDaylight.find((item) => item.command === "open")?.percent ?? "0",
      close_volt:
        rowsDaylight.find((item) => item.command === "close")?.lux ?? "0",
      close_time:
        rowsDaylight.find((item) => item.command === "close")?.percent ?? "0",
    };

    //console.log(transformedDataDayLight);

    let save = await onSaveData({
      code_name: codeName,
      list_days: JSON.stringify(selectedDay),
      list_group_name_code: JSON.stringify(resultGroupNameCode),
      list_scenes_light:
        selectedType == "time"
          ? JSON.stringify(resultTime)
          : selectedType == "light"
          ? JSON.stringify(transformedDataDayLight)
          : "[]",
      name_schedule: nameSchedule,
      type_schedule: selectedType,
      type_set: "group",
      version_light_sensor: "1",
    });
    if (save! == true) {
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
    }
  }, [
    rowsTime,
    rowsGroup,
    rowsDaylight,
    selectedDay,
    nameSchedule,
    selectedType,
  ]);

  const handleChangeType = useCallback(
    (e: any) => {
      setSelectedType(e.target.value);
    },
    [rowsDaylight, rowsTime]
    //[listGroup, dataListGroup]
  );

  const handleDeleteGroup = useCallback(
    (code: string) => {
      const updatedListGroup = rowsGroup.filter(
        (item: Group) => item.code !== code
      );
      setRowsGroup(updatedListGroup);
    },
    [rowsGroup]
  );

  const handleDeleteTime = useCallback(
    async (key: string) => {
      const updatedListTime = rowsTime.filter((item: Time) => item.key !== key);
      setRowsTime(updatedListTime);
    },
    [rowsTime]
  );

  return (
    <>
      <Button
        isIconOnly={type === "edit" ? true : false}
        aria-label="edit add Schedule"
        size="md"
        radius={type === "edit" ? "md" : "md"}
        className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15"
        onClick={() => handleOpenEdit()}
      >
        {type === "edit" ? "" : t(`add`)}
        {type === "edit" ? <Edit /> : <Plus />}
      </Button>

      <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t(`add`)}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-flow-row auto-rows-max gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="w-full"
                      onValueChange={setNameSchedule}
                      value={nameSchedule}
                      errorMessage={t(`error-valid-name`)}
                      isInvalid={nameSchedule == "" ? true : false}
                      label={t(`setting-name`)}
                      type="text"
                      variant="bordered"
                    />

                    <Select
                      className="w-full"
                      onChange={(e) => handleChangeType(e)}
                      items={listType}
                      label={t(`select-type`)}
                      isInvalid={selectedType == "" ? true : false}
                      placeholder={t(`error-select-type`)}
                      defaultSelectedKeys={[selectedType]}
                    >
                      {(type) => (
                        <SelectItem value={type.name} key={type.code}>
                          {type.name}
                        </SelectItem>
                      )}
                    </Select>
                  </div>

                  <CheckboxGroup
                    color="success"
                    onValueChange={setSelectedDay}
                    value={selectedDay}
                    isInvalid={selectedDay.length == 0 ? true : false}
                    label={t(`select-day`)}
                    orientation="horizontal"
                  >
                    <Checkbox value="mon">{t(`mon`)}</Checkbox>
                    <Checkbox value="tue">{t(`tue`)}</Checkbox>
                    <Checkbox value="wed">{t(`wed`)}</Checkbox>
                    <Checkbox value="thu">{t(`thu`)}</Checkbox>
                    <Checkbox value="fri">{t(`fri`)}</Checkbox>
                    <Checkbox value="sat">{t(`sat`)}</Checkbox>
                    <Checkbox value="sun">{t(`sun`)}</Checkbox>
                  </CheckboxGroup>

                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Autocomplete
                      className="w-full"
                      size="md"
                      isLoading={listGroup.length == 0 ? true : false}
                      isInvalid={rowsGroup.length == 0 ? true : false}
                      defaultItems={listGroup}
                      onSelectionChange={handleInputGroupChange}
                      label={t(`select-group`)}
                      placeholder={t(`search-group`)}
                    >
                      {(animal) => (
                        <AutocompleteItem key={animal.code}>
                          {animal.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <Button
                      isDisabled={selectedType == "time" ? false : true}
                      onClick={handleAddTime}
                      size="lg"
                      className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15"
                    >
                      {t(`add-task`)}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Table
                      layout="auto"
                      aria-label="table select group"
                      className="w-full"
                      isHeaderSticky
                      isStriped
                      classNames={{
                        wrapper:
                          "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                      }}
                    >
                      <TableHeader>
                        <TableColumn align="start">{t(`name`)}</TableColumn>
                        <TableColumn align="center">{t(`delete-row`)}</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent={t(`no-group-found`)}>
                        {rowsGroup.map((row) => (
                          <TableRow key={row.code}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg"
                                isIconOnly
                                onClick={() => handleDeleteGroup(row.code)}
                              >
                                <X />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {(() => {
                      switch (selectedType) {
                        case "time":
                          return (
                            <Table
                              layout="auto"
                              aria-label="table select Time"
                              className="w-full"
                              isHeaderSticky
                              isStriped
                              classNames={{
                                wrapper:
                                  "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                              }}
                            >
                              <TableHeader>
                                <TableColumn className="min-w-10" align="start">
                                  {t(`time`)}
                                </TableColumn>
                                <TableColumn align="start">{t(`dim`)}</TableColumn>
                                <TableColumn align="center">{t(`delete-row`)}</TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`no-time-found`)}>
                                {rowsTime.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell className="flex flex-col">
                                      <Input
                                        size="md"
                                        className="min-w-28"
                                        onValueChange={(value) =>
                                          handleChangeTime(row.key, value)
                                        }
                                        id="time"
                                        type="time"
                                        name="time"
                                        required
                                        defaultValue={row.time}
                                        aria-label="Time selection"
                                      />
                                    </TableCell>
                                    <TableCell className="">
                                      <Slider
                                        className="min-w-16"
                                        defaultValue={parseInt(row.dim)}
                                        step={5}
                                        onChange={(value) =>
                                          handleChangeDim(row.key, value)
                                        }
                                        minValue={0}
                                        maxValue={100}
                                        showTooltip={true}
                                        aria-label="Slider Time Dim"
                                        size="sm"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg"
                                        onClick={() =>
                                          handleDeleteTime(row.key)
                                        }
                                      >
                                        <X />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          );

                        case "light":
                          return (
                            <Table
                              layout="auto"
                              aria-label="table select light"
                              className="w-full"
                              isHeaderSticky
                              isStriped
                              classNames={{
                                wrapper:
                                  "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                              }}
                            >
                              <TableHeader>
                                <TableColumn align="start">{t(`command`)}</TableColumn>
                                <TableColumn align="start">{t(`lux`)}</TableColumn>
                                <TableColumn align="center">{t(`dim`)}</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {rowsDaylight.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell>{t(row.command)}</TableCell>
                                    <TableCell>
                                      <Slider
                                        className="min-w-16"
                                        defaultValue={parseInt(row.lux)}
                                        step={100}
                                        onChange={(value) =>
                                          handleChangeLuxSetDaylight(
                                            row.key,
                                            row.command,
                                            value
                                          )
                                        }
                                        minValue={0}
                                        maxValue={4000}
                                        showTooltip={true}
                                        aria-label="Slider Lux light"
                                        size="sm"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Slider
                                        className="min-w-16"
                                        defaultValue={parseInt(row.percent)}
                                        step={5}
                                        onChange={(value) =>
                                          handleChangeDimSetDaylight(
                                            row.key,
                                            row.command,
                                            value
                                          )
                                        }
                                        minValue={0}
                                        maxValue={100}
                                        showTooltip={true}
                                        aria-label="Slider Dim light"
                                        size="sm"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          );

                        case "manual":
                          return (
                            <Table
                              layout="fixed"
                              aria-label="table manual"
                              className="w-full"
                              isHeaderSticky
                              isStriped
                              classNames={{
                                wrapper:
                                  "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                              }}
                            >
                              <TableHeader>
                                <TableColumn align="center">
                                  {t(`manual`)}
                                </TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`manual`)}>
                                {rowsNull.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell className="">
                                      {row.time}
                                    </TableCell>
                                    <TableCell className="">
                                      {row.dim}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          );

                        default:
                          return (
                            <Table
                              layout="fixed"
                              aria-label="table notset"
                              className="w-full"
                              isHeaderSticky
                              isStriped
                              classNames={{
                                wrapper:
                                  "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                              }}
                            >
                              <TableHeader>
                                <TableColumn align="center">
                                {t(`no-setting-found`)}
                                </TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`no-setting-found`)}>
                                {rowsNull.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell>{row.time}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          );
                      }
                    })()}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isFormValid()}
                  isLoading={isLoading}
                  className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
                  onPress={handleSave}
                >
                  {t(`save`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ButtonModelEditAddSchedule;
