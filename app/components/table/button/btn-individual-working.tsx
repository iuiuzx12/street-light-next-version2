import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import { Activity, CloudMoon } from "lucide-react";
import { ListLogDeviceUserControl } from "@/app/interface/individual";
import TableIndividualWorking from "../individual-working";
interface Props {
  deviceId: string;
  onListLogDeviceUserControl: (deviceId: string , day : string) => Promise<ListLogDeviceUserControl[]>;
}

const ButtonModelListIndividualWorking: React.FC<Props> = ({ deviceId ,onListLogDeviceUserControl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataListLogDeviceUserControl, setListLogDeviceUserControl] = useState<ListLogDeviceUserControl[]>([])
  const handleOpenDetail = async () => {
    let dataListLogUserControl = await onListLogDeviceUserControl(deviceId, "1");
    setListLogDeviceUserControl(dataListLogUserControl)
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
            onPress={() => handleOpenDetail()}
          >
            <Activity />
            
          </Button>

      <Modal size={"2xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
              <div className="flex w-full flex-col">
              <div className="grid grid-cols-12 gap-2">
                <h1>{deviceId}</h1>
                        <div className="col-span-full">
                          <TableIndividualWorking deviceId={deviceId} listLogDeviceUserControl={dataListLogDeviceUserControl} onListLogDeviceUserControl={onListLogDeviceUserControl}></TableIndividualWorking>
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
export default ButtonModelListIndividualWorking;
