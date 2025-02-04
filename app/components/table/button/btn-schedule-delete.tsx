import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { SaveSchedule } from "@/app/interface/schedule";
interface Props {
  disabled: boolean;
  nameSchedule: string;
  groupCode: string;
  nameCode : string;
  onDeleteData: (codeName: string) => void;
  onSaveData: ( data : SaveSchedule) => void;
}
const ButtonModelDeleteSchedule: React.FC<Props> = ({
  disabled,
  nameSchedule,
  groupCode,
  nameCode,
  onSaveData
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const t = useTranslations("ControlSchedule");
  const handleOpenDelete = () => {
    onOpen();
  };
  const confirmDelete = async () => {
    setLoadingDelete(true);
  
    let save = await onSaveData({
      code_name : groupCode,
      list_days : JSON.stringify(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]),
      list_group_name_code : nameCode,
      list_scenes_light : "[]",
      name_schedule : nameSchedule,
      type_schedule : "manual",
      type_set : "delete",
      version_light_sensor : "1"
    })
    if(save! == true){
      setLoadingDelete(false)
      onClose()
    }
    else{
      setLoadingDelete(false)
    }
  };

  return (
    <>
      <Button
        isIconOnly
        isDisabled={!disabled}
        isLoading={isLoadingDelete}
        aria-label="delete Schedule"
        size="md"
        radius="md"
        className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15"
        onClick={() => handleOpenDelete()}
      >
        <Trash2 />
      </Button>

      <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t(`delete`)}
              </ModalHeader>
              <ModalBody></ModalBody>
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
                  color="danger"
                  onPress={confirmDelete}
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
export default ButtonModelDeleteSchedule;