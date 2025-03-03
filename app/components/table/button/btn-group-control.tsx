import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { Power } from "lucide-react";
import { ListDevice } from "@/app/interface/control";
import TableControlGroup from "../group-control";
import { ListLatLong } from "@/app/interface/map";
import { useTranslations } from "next-intl";
import { RuleUserItem } from "@/app/model/rule";

interface Props {
  rule : RuleUserItem;
  groupName: string;
  groupCode: string;
  onReloadLatLong : (typeSearch : string, dataSearch : string) => Promise<ListLatLong[]>;
  onDetail: (group_name: string) => Promise<ListDevice[]>;
  onSendCommand : (typeOpen : string , value : string, commandType : string , dimPercent : string) => Promise<ListLatLong[]>;
}

const ButtonModelControl: React.FC<Props> = ({rule, groupName, groupCode, onDetail , onSendCommand, onReloadLatLong}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataListDevice, setListDevice] = useState<ListDevice[]>([]);
  const t = useTranslations("ControlGroup");

  const handleOpenDetail = async () => {
    let dataListDevice = await onDetail(groupName);
    setListDevice(dataListDevice);

    onOpen();
  };

  return (
    <>
      <Button
            style={{ float: "right" }}
            aria-label="control group"
            isDisabled={!rule.control}
            size="md"
            radius="md"
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15"
            onPress={() => handleOpenDetail()}
          >
            {t(`control`)}
            <Power />
            
          </Button>
      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex w-full flex-col">
                <div className="grid grid-cols-12 gap-2">
                      {t(`control`)}
                        <div className="col-span-full">
                          <TableControlGroup
                            dataRule={rule}
                            groupName={groupName}
                            groupCode={groupCode}
                            listDevice={dataListDevice}
                            onReloadLatLong={onReloadLatLong}
                            onSendCommand={onSendCommand}
                          ></TableControlGroup>
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
export default ButtonModelControl;
