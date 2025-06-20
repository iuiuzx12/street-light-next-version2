import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip} from "@heroui/react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
interface Props {
    disabled : boolean;
    groupName : string;
    groupCode : string;
    onSendData: (
        dataGroupName: string,
        dataGroupCode : string) => void;
}

const ButtonModelDelete: React.FC<Props> = ({disabled, groupName , groupCode, onSendData }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const t = useTranslations("ControlGroup");

  const handleOpenDelete = () => {
    onOpen()
  }

  const confirmDelete = () => {
    setLoadingDelete(true)
    setLoadingDelete(true)
    let result = onSendData(groupName, groupCode)
    if(result! == true){
        setLoadingDelete(false)
        onClose()
    }
  }

  return (
    <>
      
      <Button
            style={{ float: "right" , cursor: groupName === "ALL" ? 'not-allowed ' : 'pointer' }}
            //isIconOnly
            isDisabled={groupName === "ALL" ? true : !disabled}
            isLoading={isLoadingDelete}
            aria-label="delete group"
            
            size="md"
            radius="md"
            className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15"
            onPress={() => handleOpenDelete()}
          >
            {t(`delete`)}
            <Trash2 />
          </Button>

      <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t(`delete`)}
              </ModalHeader>
              <ModalBody>
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" aria-label="close" variant="light" onPress={onCloseDelete}>
                  {t(`close`)}
                </Button>
                <Button 
                  aria-label="yes"
                  isLoading={isLoadingDelete}
                  color="primary" 
                  onPress={confirmDelete}>
                  {t(`yes`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export default ButtonModelDelete;