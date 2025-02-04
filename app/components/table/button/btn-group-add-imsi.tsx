import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import { ListDevice, ListImsi } from "@/app/interface/control";
import TableImsiGroup from "../group-imsi";
import { useTranslations } from "next-intl";

interface Props {
  disabled: boolean;
  groupName: string;
  groupCode: string;
  onDetail: (group_name: string) => Promise<ListDevice[]>;
  onDataImsiAll: () => Promise<ListImsi[]>;
  onDeleteImsiInGroup : (dataGroupName: string, dataGroupCode: string, dataImsi : string) => Promise<ListDevice[]>;
  onSaveDataDevice : (dataGroupName : string ,imsi : string , latLamp : string, longLamp : string , namePole : string , nameGov : string) => Promise<ListDevice[]>;
  onAddImsiGroup : (dataGroupName: string, dataGroupCode: string, dataImsi : string) => Promise<ListDevice[]>;
}

const ButtonModelListImsi: React.FC<Props> = ({disabled, groupName, groupCode, onDetail, onDeleteImsiInGroup, onDataImsiAll ,onAddImsiGroup ,onSaveDataDevice }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const [dataListDevice, setListDevice] = useState<ListDevice[]>([]);
  const [dataListImsiTotal, setListImsiTotal] = useState<ListImsi[]>([]);
  const t = useTranslations("ControlGroup");

  const handleOpenDetail = async () => {
    let dataListDevice = await onDetail(groupName);
    let dataListImsiTotal = await onDataImsiAll();
    setListDevice(dataListDevice);
    setListImsiTotal(dataListImsiTotal);
    onOpen();
  };

  return (
    <>
      <Button
            style={{ float: "right" }}
            //isIconOnly
            //isDisabled={groupName === "ALL" ? true : false}
            size="md"
            radius="md"
            aria-label="add imsi"
            className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
            onClick={() => handleOpenDetail()}
          >
            {t(`add-imsi`)}
            <CirclePlus />
            
          </Button>

      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex w-full flex-col">
                <h1>{t(`add-imsi`)}</h1>
                        <div className="col-span-full">
                          <TableImsiGroup
                            disabled={disabled}
                            groupName={groupName}
                            groupCode={groupCode}
                            listDevice={dataListDevice}
                            onDeleteImsiInGroup={onDeleteImsiInGroup}
                            onSaveDataDevice={onSaveDataDevice}
                            onAddImsiGroup={onAddImsiGroup}
                            onDataImsiAll={dataListImsiTotal}
                          ></TableImsiGroup>
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
export default ButtonModelListImsi;
