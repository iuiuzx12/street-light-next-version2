import React, { Key, useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Table,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { ListChecks, X } from "lucide-react";
interface Props {
  type: string;
}

const ButtonModelResponseSchedule: React.FC<Props> = ({ type }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const t = useTranslations("ControlGroup");

  const handleOpenDelete = () => {
    onOpen();
  };

  const handleAddData = () => {
    setRows( [ {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },])
  };

  

  const [rows, setRows] = useState<Array<Group>>([]);

  const confirmDelete = useCallback( (data : string) => {
    //setLoadingDelete(true);
    //setLoadingDelete(true);
    //let result = onSendData(groupName, groupCode)
    //if(result! == true){
    //    setLoadingDelete(false)
    //    onClose()
    //}
    console.log(rows)

    const updatedListGroup = rows.filter((item : Group) => item.key !== data);
    setRows(updatedListGroup);
  }, [rows]);

  const rows2 = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];

  type Group = {
    key: string;
    name: string;
    status: string;
    role: string;
  };

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "key",
      label: "STATUS",
    },
  ];

  const renderCellGroup = React.useCallback(
    
    (groupAll: Group, columnKey: React.Key) => {
        
      const cellValue = groupAll[columnKey as keyof Group];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col h-10">
              <p className="text-bold h-10 text-sm capitalize">{cellValue}</p>
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
             <Button className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg" size="sm" isIconOnly onClick={() => confirmDelete(cellValue)}> <X/> </Button>
            </div>
          );

        default:
            //setIsLoaded(true)
            return cellValue;
      }
    },
    [rows]
  );

  return (
    <>
      <Button
        isLoading={isLoadingDelete}
        aria-label="Response Schedule"
        isIconOnly
        size="md"
        radius="md"
        className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
        onClick={() => handleOpenDelete()}
      >
        <ListChecks />
      </Button>

      <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t(`delete`)}
              </ModalHeader>
              <ModalBody>
              <div className="grid grid-flow-row auto-rows-max gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Table 
                  classNames={{
                    wrapper: "h-[calc(100vh-510px)] md:h-[calc(100vh-590px)]",
                  }}
                  className="w-full" aria-label="Example table with dynamic content">
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={rows}>
                      {(item) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell>
                              {/* {getKeyValue(item, columnKey)} */}
                              {renderCellGroup(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <Button onClick={handleAddData}></Button>
                </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  aria-label="close"
                  variant="light"
                  onPress={onCloseDelete}
                >
                  {t(`close`)}
                </Button>
                <Button
                  aria-label="yes"
                  isLoading={isLoadingDelete}
                  color="primary"
                  //onPress={confirmDelete}
                >
                  {t(`yes`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ButtonModelResponseSchedule;
