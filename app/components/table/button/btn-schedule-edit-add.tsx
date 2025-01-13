import React, { Key, useCallback, useMemo, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip, Input, CheckboxGroup, Checkbox, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Autocomplete, AutocompleteItem, Pagination, Slider} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Plus , Edit, Delete, Group, X } from "lucide-react";
interface Props {
    type : string
}

const ButtonModelEditAddSchedule: React.FC<Props> = ({ type }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const t = useTranslations("ControlGroup");

  const handleOpenDelete = () => {
    onOpen()
  }

   let listGroup = [
    {code: "C1", name: "CatCatCatCatCatCatCa 14"},
    {code: "D1", name: "Dog 13"},
    {code: "F1", name: "Fog 12 FF"},
    {code: "G1", name: "Goggggggggggggggggggg-GG 33"},
  ];

  const listType = [
    {code: "1", name: "Time"},
    {code: "2", name: "Daylight"},
    {code: "3", name: "Manual"},
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

  type Manual = {
    key: string;
    label: string;
  };

  type Group = {
    code: string;
    name: string;
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedType, setSelectedType] = useState("time");

  const handleChange = (selected : any) => {
    setSelectedItems(selected);
  };

  const [rowsGroup, setRowsGroup] = useState<Array<Group>>([]);
  const [rowsManual, setRowsManual] = useState<Array<Manual>>([]);
  let [rowsTime, setRowsTime] = useState<Array<Time>>([]);
  const [rowsTime2, setRowsTime2] = useState<Array<Time>>([]);
  const [rowsDaylight, setRowsDaylight] = useState<Array<Daylight>>([
    {
      key: "1",
      command: "open",
      lux: "4000",
      percent: "100",
    },
    {
      key: "2",
      command: "close",
      lux: "3000",
      percent: "0",
    },
  ]);
  
  const columnsGroup = [
    {
      key: "name",
      label: "name",
      align : "start"
    },
    {
      key: "code",
      label: "X",
      align : "center"
    },
  ];

  const columnsTime = [
    {
      key: "time",
      label: "Time",
      align : "start"
    },
    {
      key: "dim",
      label: "Dim",
      align : "start"
    },
    {
      key: "key",
      label: "X",
      align : "center"
    },
  ];

  const columnsDaylight = [
    {
      key: "command",
      label: "Command",
      align : "start"
    },
    {
      key: "lux",
      label: "LUX",
      align : "start"
    },
    {
      key: "percent",
      label: "%",
      align : "center"
    },
  ];

  const columnsManual = [
    {
      key: "manual",
      label: "Manual",
      align : "center"
    },
  ];

  const handleInputGroupChange = useCallback (async (newValue: Key | null) => {
      if(newValue !== null){
          let dataDay : string = newValue.toString();
          let found = listGroup.find((element) => element.code == dataDay);
          if(rowsGroup.find((element) => element.code == dataDay)){
            return false;
          }
          console.log(found)
          let rowsGroup2 = 
          {
            code: found?.code == null ? "" : found?.code,
            name: found?.name == null ? "" : found?.name ,
          };

          setRowsGroup(prevRows => [...prevRows, rowsGroup2]);
      }
    } ,[rowsGroup]);

  const handleAddTime = useCallback ( async () => {
      if(rowsTime.length > 11){
        return false;
      }
      const newRowTime = 
          {
            key: Math.random().toString(),
            time: "00:00",
            dim: "0",
          };

          setRowsTime((prevRows) => [...prevRows, newRowTime]);
          setRowsTime2((prevRows) => [...prevRows, newRowTime]);
  } , [rowsTime, rowsTime2]);

 

  const handleChangeTime = useCallback ((key: string , value : string) => {
    console.log(value)
    console.log(key)
    const index = itemsTime.findIndex(item => item["key"] === key);
    console.log(index)
    //const updatedTime = 
    //let updatedItems = [...rowsTime]; 
    itemsTime[index] = { ...itemsTime[index], ["time"]: value };
    // const updatedItems = [...rowsTime]; 
    // for (let i = 0; i < updatedItems.length; i++) {
    //   if (updatedItems[i].key === key) {
    //     updatedItems[i] = { ...updatedItems[i], time: value }; // อัปเดตค่า name
    //     //break; // หยุดหลังจากอัปเดตแล้ว
    //   }
    console.log(itemsTime[index])
    console.log(itemsTime)
    //rowsTime
    //setRowsTime(itemsTime)
    //setRowsTime2(rowsTime2.map(item =>
    //  item.key === key ? { ...item, time: value } : item
    //));
    //console.log(updatedTime)
  } ,[rowsTime, rowsTime2]);

  const handleChangeDim = useCallback ((key: string , value : number | number[]) => {
   
    console.log(value)
    console.log(key)
    const updatedDim = rowsTime.map(item =>
      item.key === key ? { ...item, dim: value.toString() } : item
    );

    setRowsTime(updatedDim);
    console.log(updatedDim)

  } ,[rowsTime]);

  const handleChangeDimSetDaylight = useCallback ((key: string , value : any) => {
    const updatedDim = rowsDaylight.map(item =>
      item.key === key ? { ...item, percent: value == undefined ? "0" : parseInt(value) > 100  ? "100" : parseInt(value) < 0  ? "0" : value } : item
    );

    setRowsDaylight(updatedDim);

  } ,[rowsDaylight]);

  const handleSave = useCallback (() => {
    console.log(rowsGroup)
    console.log(rowsTime)
    console.log(rowsTime2)
  } ,[rowsTime ,rowsTime2]);

  const handleTes = useCallback ((e : any) => {
    console.log(e.target.value)
    setSelectedType(e.target.value == "1" ? "time" : 
      e.target.value == "2" ? "daylight" : "manual")
  } ,[selectedType]);

  const  handleDeleteGroup = useCallback ( (code: string) => {
    const updatedListGroup = rowsGroup.filter((item : Group) => item.code !== code);
      setRowsGroup(updatedListGroup);
    } , [rowsGroup]);

    const  handleDeleteTime = useCallback ( async (key: string) => {
      const updatedListTime = rowsTime.filter((item : Time) => item.key !== key);
      setRowsTime(updatedListTime);
    } , [rowsTime]);

  const [pageGroup, setPageGroup] = React.useState(1);
  const [pageTime, setPageTime] = React.useState(1);
  const rowsPerPage = 12;

  const pagesGroup = Math.ceil(rowsGroup.length / rowsPerPage);
  const pagesTime = Math.ceil(rowsTime.length / rowsPerPage);
  
  const itemsGroup = React.useMemo(() => {
    const start = (pageGroup - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rowsGroup.slice(start, end);
  }, [pageGroup, rowsGroup]);

  const itemsTime = React.useMemo(() => {
    const start = (pageTime - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rowsTime.slice(start, end);
  }, [pageTime, rowsTime ]);


  const renderCellGroup = useCallback(
    
    (groupAll: Group, columnKey: Key) => {
        
      const cellValue = groupAll[columnKey as keyof Group];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col h-10">
              <p className="text-bold h-10 text-sm capitalize">{cellValue}</p>
            </div>
          );

        case "code":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
             <Button className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg" size="sm" isIconOnly onClick={() => handleDeleteGroup(cellValue)}> <X/> </Button>
            </div>
          );

        default:
            //setIsLoaded(true)
            return cellValue;
      }
    },
    [rowsGroup]
  );

  const renderCellTime = (
    
    (groupAll: Time, columnKey: Key) => {
        
      const cellValue = groupAll[columnKey as keyof Time];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "time":
          return (
            <div className="flex flex-col">
               <Input 
                onValueChange={(value) => handleChangeTime( groupAll.key, value)}
                type="time" 
                name="time"
                required
                defaultValue={cellValue}
                aria-label="Time selection"
        />
            </div>
          );

        case "dim":
          return (
            <div className="flex flex-col">
              {/* <Input 
                onValueChange={(value) => handleChangeDim( groupAll.key, value)}
                type="Number" 
                name="time"
                className="min-w-20"
                min={0}
                max={100}
                step={10}
                required
                defaultValue={cellValue}
                aria-label="Time selection"
        /> */}
              <Slider
                className="min-w-16"
                defaultValue={0}
                step={5}
                onChange={(value) => handleChangeDim( groupAll.key, value)}
                minValue={0}
                maxValue={100}
                showTooltip={true}
                aria-label="Slider Time Dim"
                size="sm"
              />
            </div>
          );

        case "key":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
             <Button className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg" size="sm" isIconOnly onPress={() => handleDeleteTime(cellValue)} > <X/> </Button>
            </div>
          );

        default:
            //setIsLoaded(true)
            return cellValue;
      }
    }
  );

  const renderCellDaylight = useCallback(
    
    (daylight: Daylight, columnKey: Key) => {
        
      const cellValue = daylight[columnKey as keyof Daylight];

      switch (columnKey) {
        
        case "lux":
          return (
            <div className="flex flex-col">
               <Input 
                //onValueChange={(value) => handleChangeDim( daylight.lux, value)}
                type="Number" 
                name="lux"
                className="min-w-10"
                min={0}
                max={4000}
                step={1}
                required
                defaultValue={cellValue}
                aria-label="lux selection"
              />
            </div>
          );

        case "percent":
          return (
            <div className="flex flex-col">
               <Input 
                //onValueChange={(value) => handleChangeDim( daylight.percent, value)}
                type="Number" 
                name="percent"
                className="min-w-10"
                min={0}
                max={100}
                step={10}
                required
                defaultValue={cellValue}
                aria-label="percent selection"
              />
            </div>
          );

        case "key":
          return (
            <div
              className="flex items-center gap-10"
              style={{
                placeSelf: "center",
              }}
            >
             <Button className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg" size="md" isIconOnly onPress={() => handleDeleteTime(cellValue)} > <X/> </Button>
            </div>
          );

        default:
            //setIsLoaded(true)
            return cellValue;
      }
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
                      errorMessage="Please enter a valid Name"
                      isInvalid={true}
                      label="Name Schedule"
                      type="text"
                      variant="bordered"
                    />

                    <Select
                      className="w-full"
                      onChange={(e) => handleTes(e)}
                      items={listType}
                      label="List Type"
                      placeholder="Select an Type"
                    >
                      {(type) => (
                        <SelectItem value={type.name} key={type.code} >{type.name}</SelectItem>
                      )}
                    </Select>
                  </div>

                  <CheckboxGroup
                    color="success"
                    defaultValue={["buenos-aires", "san-francisco"]}
                    label="Select Day"
                    orientation="horizontal"
                  >
                    <Checkbox value="buenos-aires">Buenos</Checkbox>
                    <Checkbox value="sydney">Sydney</Checkbox>
                    <Checkbox value="san-francisco">San</Checkbox>
                    <Checkbox value="london">London</Checkbox>
                    <Checkbox value="tokyo">Tokyo</Checkbox>
                  </CheckboxGroup>

                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Autocomplete
                      className="w-full"
                      size="md"
                      defaultItems={listGroup}
                      //onInputChange={handleInputChange}
                      onSelectionChange={handleInputGroupChange}
                      //onClose={handleInputChangeTest}
                      
                      label="Favorite Animal"
                      placeholder="Search an animal"
                    >
                      {(animal) => (
                        <AutocompleteItem key={animal.code}>
                          {animal.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <Button isDisabled={selectedType == "time" ? false : true} onClick={handleAddTime} size="lg" className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15"> เพิ่มงาน </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">

                  <Table
                    layout="fixed"
                    aria-label="table select group"
                    className="w-full"
                    isHeaderSticky
                    isStriped
                    classNames={{
                      wrapper: "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                    }}
                  >
                    <TableHeader columns={columnsGroup}>
                      {(column) => (
                        <TableColumn align={column.align == "start" ? "start" : "center"} key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody emptyContent={t(`no-device-found`)} items={itemsGroup}>
                      {(item) => (
                        <TableRow key={item.code}>
                          {(columnKey) => (
                            <TableCell>
                              {renderCellGroup(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <Table
                    aria-label="table select time"
                    className="w-full"
                    isHeaderSticky
                    isStriped
                    layout="auto"
                      classNames={{
                        wrapper: "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                      }}
                  >
                    <TableHeader columns={selectedType == "time" ?  columnsTime : selectedType == "daylight" ? columnsDaylight : columnsManual}>
                      {(column) => (
                        <TableColumn align={column.align == "start" ? "start" : "center"} key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody emptyContent={t(`no-device-found`)} items={selectedType == "time" ? itemsTime : selectedType == "daylight" ? rowsDaylight : rowsManual}>
                      {(item : any) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell>
                              {selectedType == "time" ? renderCellTime(item, columnKey) : selectedType == "daylight" ?  renderCellDaylight(item , columnKey) : "" }
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>


                  </div>

                  
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg" onPress={handleSave}>Save</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default ButtonModelEditAddSchedule;