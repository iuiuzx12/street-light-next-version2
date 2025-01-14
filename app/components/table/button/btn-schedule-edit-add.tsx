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
interface Props {
  type: string;
}

const ButtonModelEditAddSchedule: React.FC<Props> = ({ type }) => {

  let listGroup = [
    { code: "C1", name: "CatCatCatCatCatCatCa 14" },
    { code: "D1", name: "Dog 13" },
    { code: "F1", name: "Fog 12 FF" },
    { code: "G1", name: "Goggggggggggggggggggg-GG 33" },
  ];

  const listType = [
    { code: "1", name: "Time" },
    { code: "2", name: "Daylight" },
    { code: "3", name: "Manual" },
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
  const t = useTranslations("ControlGroup");
  const [selectedDay, setSelectedDay] = React.useState(["mon", "tue", "wed" ,"thu" ,"fri" ,"sat" , "sun"]);
  const [nameSchedule, setNameSchedule] = React.useState("");
  const [rowsNull, setRowsNull] = useState<Array<any>>([]);
  const [selectedType, setSelectedType] = useState("time");
  const [rowsGroup, setRowsGroup] = useState<Array<Group>>([]);
  const [rowsTime, setRowsTime] = useState<Array<Time>>([]);
  const [rowsDaylight, setRowsDaylight] = useState<Array<Daylight>>([
    {
      key: "1",
      command: "open",
      lux: "0",
      percent: "100",
    },
    {
      key: "2",
      command: "close",
      lux: "4000",
      percent: "0",
    },
  ]);

  const handleOpenDelete = () => {
    onOpen();
  };
  

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
    [rowsGroup]
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
      setRowsTime(rowsTime)
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
    (key: string , command : string , value: any) => {
      const updatedDim = rowsDaylight.map((item) =>
        item.key === key && item.command === command ? { ...item, percent: value.toString() } : item
      );
      setRowsDaylight(updatedDim);
    },
    [rowsDaylight]
  );

  const handleChangeLuxSetDaylight = useCallback(
    (key: string , command : string , value: any) => {
      const updatedDim = rowsDaylight.map((item) =>
        item.key === key && item.command === command ? { ...item, lux: value.toString() } : item
      );
      setRowsDaylight(updatedDim);
    },
    [rowsDaylight]
  );

  const handleSave = useCallback(() => {
    console.log(rowsGroup);
    console.log(rowsTime);
    console.log(rowsDaylight);
    console.log(selectedDay)
    console.log(nameSchedule)
  }, [rowsTime, rowsGroup, rowsDaylight, selectedDay, nameSchedule]);

  const handleChangeType = useCallback(
    (e: any) => {
      setSelectedType(
        e.target.value == "1" ? "time"
          : e.target.value == "2" ? "daylight" 
          : e.target.value == "3" ? "manual" 
          : "notSet"
      );

    },
    [selectedType, rowsGroup, rowsTime]
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
        onClick={() => handleOpenDelete()}
      >
        {type === "edit" ? "" : t(`delete`)}
        {type === "edit" ? <Edit /> : <Plus />}
      </Button>

      <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {"Add Schedule"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-flow-row auto-rows-max gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="w-full"
                      onValueChange={setNameSchedule}
                      value={nameSchedule}
                      errorMessage="Please enter a valid Name"
                      isInvalid={nameSchedule == "" ? true : false}
                      label="Name Schedule"
                      type="text"
                      variant="bordered"
                    />

                    <Select
                      className="w-full"
                      onChange={(e) => handleChangeType(e)}
                      items={listType}
                      label="List Type"
                      placeholder="Select an Type"
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
                    label="Select Day"
                    orientation="horizontal"
                  >
                    <Checkbox value="mon">MON</Checkbox>
                    <Checkbox value="tue">TUE</Checkbox>
                    <Checkbox value="wed">WED</Checkbox>
                    <Checkbox value="thu">THU</Checkbox>
                    <Checkbox value="fri">FRI</Checkbox>
                    <Checkbox value="sat">SAT</Checkbox>
                    <Checkbox value="sun">SUN</Checkbox>
                  </CheckboxGroup>

                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Autocomplete
                      className="w-full"
                      size="md"
                      defaultItems={listGroup}
                      onSelectionChange={handleInputGroupChange}
                      label="Favorite Animal"
                      placeholder="Search an animal"
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
                      เพิ่มงาน
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
                        <TableColumn align="start">Name</TableColumn>
                        <TableColumn align="center">X</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent={t(`no-device-found`)}>
                        {rowsGroup.map((row) => (
                          <TableRow key={row.code}>
                            <TableCell className="">{row.name}</TableCell>
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
                                <TableColumn className="min-w-32" align="start">
                                  DD
                                </TableColumn>
                                <TableColumn align="start">D2</TableColumn>
                                <TableColumn align="center">FF</TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`no-device-found`)}>
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
                                        defaultValue={0}
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

                        case "daylight":
                          return (
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
                                <TableColumn align="start">CC</TableColumn>
                                <TableColumn align="start">GG</TableColumn>
                                <TableColumn align="center">FF</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {rowsDaylight.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell >
                                      {row.command}
                                    </TableCell>
                                    <TableCell >
                                     
                                      <Slider
                                        className="min-w-16"
                                        defaultValue={0}
                                        step={100}
                                        onChange={(value) =>
                                          handleChangeLuxSetDaylight(row.key , row.command, value)
                                        }
                                        minValue={0}
                                        maxValue={4000}
                                        showTooltip={true}
                                        aria-label="Slider Time Dim"
                                        size="sm"
                                      />
                                    </TableCell>
                                    <TableCell><Slider
                                        className="min-w-16"
                                        defaultValue={0}
                                        step={5}
                                        onChange={(value) =>
                                          handleChangeDimSetDaylight(row.key,row.command, value)
                                        }
                                        minValue={0}
                                        maxValue={100}
                                        showTooltip={true}
                                        aria-label="Slider Time Dim"
                                        size="sm"
                                      /></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          );

                        case "manual":
                          return (
                            <Table
                              layout="fixed"
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
                                <TableColumn align="center">
                                  ปิดเซ็นเซอร์ทั้งหมด
                                </TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`no-device-found`)}>
                                {rowsNull.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell className="">
                                      {row.time}
                                    </TableCell>
                                    <TableCell className="">
                                      {row.dim}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        onClick={() =>
                                          handleDeleteTime(row.key)
                                        }
                                      >
                                        ลบ
                                      </Button>
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
                                <TableColumn align="center">
                                  ไม่ได้เลือกการตั้งค่า
                                </TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={t(`no-device-found`)}>
                              {rowsNull.map((row) => (
                                  <TableRow key={row.key}>
                                    <TableCell >
                                      {row.time}
                                    </TableCell>
                                    
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
                  className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
                  onPress={handleSave}
                >
                  Save
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