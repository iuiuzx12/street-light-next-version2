import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Pagination,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { ListChecks } from "lucide-react";
import { ListResponseSchedule } from "@/app/interface/schedule";
import ButtonResend from "./btn-schedule-resend";
interface Props {
  type: string;
  groupCode: string;
  listResponseSchedule : (groupCode : string) => Promise<ListResponseSchedule[]>;
  resendCommad : (imsi: string , mode : string , lastUpdate : string) => Promise<string>;
}

const ButtonModelResponseSchedule: React.FC<Props> = ({ type , groupCode , listResponseSchedule , resendCommad  }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations("ControlSchedule");
  
  const handleOpenResponse = async () => {
    var listData = await listResponseSchedule(groupCode)
    setData(listData)
    onOpen();
  };

  const setResponse = async (imsi: string) => {
    setData(prevData => 
      prevData.map((row) => 
        row.imsi === imsi ? { ...row, status : 'respone' } : row
      )
    );
  };

  const formattedDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000); 
  
    return date.toLocaleString(t(`locale-string`), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const [data, setData] = useState<ListResponseSchedule[]>([]);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 8;
  const pages = Math.ceil(data.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  return (
    <>
      <Button
        aria-label="Response Schedule"
        isIconOnly
        size="md"
        radius="md"
        className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
        onPress={() => handleOpenResponse()}
      >
        <ListChecks />
      </Button>

      <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                {t(`response`)} : { data.filter(item => item.status === "respone").length } / {t(`not-response`)} : {data.filter(item => item.status === "wait response").length}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-flow-row auto-rows-max gap-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Table 
                      isStriped 
                      aria-label="Response Table"
                      bottomContentPlacement="outside"
                      bottomContent={
                        <div className="flex w-full justify-center">
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                          />
                        </div>
                      }
                      classNames={{
                        wrapper: "h-[calc(100vh-420px)]",
                      }}
                      >
                      <TableHeader>
                        <TableColumn>{t(`device`)}</TableColumn>
                        <TableColumn>{t(`last-update`)}</TableColumn>
                        <TableColumn>{t(`status`)}</TableColumn>
                        <TableColumn>{t(`resend`)}</TableColumn>
                      </TableHeader>
                      <TableBody 
                        
                        emptyContent={t(`no-setting-found`)} >
                        {items.map((row) => (
                          <TableRow key={row.imsi}>
                            <TableCell>{row.imsi}</TableCell>
                            <TableCell>{formattedDate(row.last_update)}</TableCell>
                            <TableCell>{t(row.status)}</TableCell>
                            <TableCell>
                              <ButtonResend imsi={row.imsi} lastUpdate={row.last_update} mode={type} status={row.status} resendCommad={resendCommad} setResponse={setResponse}> </ButtonResend>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ButtonModelResponseSchedule;
