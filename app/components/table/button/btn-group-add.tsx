import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Input} from "@heroui/react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";


interface Props {
    onSendData: (dataGroupName: string) => void;
}

const ButtonModalAddGroup: React.FC<Props> = ({  onSendData }) => {

  const t = useTranslations("ControlGroup");
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingSave, setLoadingSave] = useState(false);
  const [dataGroup , setDataGroup] = useState('')


  const handleOpen = () => {
    onOpen();
    setDataGroup('');
    
  }

  const handleSave = async () => {
    setLoadingSave(true)
    let result = await onSendData(dataGroup)
    if(result! == true){
        setLoadingSave(false)
      onClose()
    }
  }

  const handleDelete = async () => {
    
  }

  const handleChange = (event : any) =>{
    setDataGroup(event.target.value)
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button  
          onPress={() => handleOpen()} 
          aria-label="add new group"
          className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15" 
          endContent={
            <Plus /> }
          >
          {t(`add-new-group`)}
        </Button>
      </div>
      <Modal 
        size={"md"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t(`add-group`)}</ModalHeader>
              <ModalBody>
              <Input type="text" label={t(`group-name`)} placeholder={t(`placeholder-group-name`)} value={dataGroup} onChange={handleChange} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" aria-label="close" variant="light" onPress={onClose}>
                  {t(`close`)}
                </Button>
                <Button isDisabled={dataGroup == '' ? true : false} aria-label="save" isLoading={isLoadingSave} color="primary" onPress={handleSave}>
                  {t(`save`)} 
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ButtonModalAddGroup;