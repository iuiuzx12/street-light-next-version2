import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { FileText } from "lucide-react";
import { ListLogDevice } from "@/app/interface/individual";
import TableIndividualLog from "../individual-log";
interface Props {
  deviceId: string;
  onListLogDevice: (deviceId: string , day : string) => Promise<ListLogDevice>;
}

const ButtonModelListIndividualLog: React.FC<Props> = ({ deviceId, onListLogDevice }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataListLogDevice, setListLogDevice] = useState<ListLogDevice>({data : [{ id : 1, i : "", pf : "",ts : "" ,v : "",w : "",date : "",time : ""}], averageWatt : "", averageVolt : "", averageI : ""});
  const handleOpenDetail = async () => {
    let dataListLogDevice = await onListLogDevice(deviceId, "1");
    setListLogDevice(dataListLogDevice)
    onOpen();
  };

  return (
    <>
      <Button
            style={{ float: "right" }}
            isIconOnly
            //isDisabled={groupName === "ALL" ? true : false}
            size="md"
            radius="md"
            aria-label="add imsi"
            className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
            onClick={() => handleOpenDetail()}
          >
            <FileText />
            
          </Button>

      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
              <div className="flex w-full flex-col">
              <div className="grid grid-cols-12 gap-2">
                <h1>{deviceId}</h1>
                        <div className="col-span-full">
                          <TableIndividualLog deviceId={deviceId} onListLogDevice={onListLogDevice} listLogDevice={dataListLogDevice}></TableIndividualLog>
                        </div>
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
export default ButtonModelListIndividualLog;
