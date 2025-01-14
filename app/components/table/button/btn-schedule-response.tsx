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
  Input,
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

  const handleSave = () => {
     console.log(data)
  };


  const initialData = [
    {
      id: 1,
      A: "Data A1",
      B: "Data B1",
      C: "Data C1",
      D: "Data D1",
      F: "Data F1",
    },
    {
      id: 2,
      A: "Data A2",
      B: "Data B2",
      C: "Data C2",
      D: "Data D2",
      F: "Data F2",
    },
    {
      id: 3,
      A: "Data A3",
      B: "Data B3",
      C: "Data C3",
      D: "Data D3",
      F: "Data F3",
    },
  ];

  // สร้าง state สำหรับจัดการข้อมูล
  const [data, setData] = useState(initialData);

  const handleInputChange = (id: number, field: string, value: string) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleDeleteRow = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

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
                  <div className="grid grid-cols-1 gap-2">
                    <Table aria-label="Editable Table">
                      <TableHeader>
                        <TableColumn>A</TableColumn>
                        <TableColumn>B</TableColumn>
                        <TableColumn>C</TableColumn>
                        <TableColumn>D</TableColumn>
                        <TableColumn>F</TableColumn>
                        <TableColumn>Actions</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.A}</TableCell>
                            <TableCell>{row.B}</TableCell>
                            <TableCell>{row.C}</TableCell>
                            <TableCell>
                              <Input
                                value={row.D}
                                onChange={(e) =>
                                  handleInputChange(row.id, "D", e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>{row.F}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleDeleteRow(row.id)}>
                                ลบ
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                  onPress={handleSave}
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
