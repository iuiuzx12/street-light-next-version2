import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

interface Props {
    groupName : string;
    groupCode : string;
    onSendData: (
        dataGroupName: string,
        dataGroupCode : string) => void;
}

const ButtonModelDelete: React.FC<Props> = ({groupName , groupCode, onSendData }) => {
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
            isDisabled={groupName === "ALL" ? true : false}
            isLoading={isLoadingDelete}
            aria-label="delete group"
            
            size="md"
            radius="md"
            className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15"
            onClick={() => handleOpenDelete()}
          >
            {t(`delete`)}
            <Icon icon="lucide:trash-2" width="auto" height="auto" />
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