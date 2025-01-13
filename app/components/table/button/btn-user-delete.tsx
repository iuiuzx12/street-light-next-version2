import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ButtonProps {
  userId: string;
  onDelete: (userId: string) => void;
}

const ButtonModalUserDelete: React.FC<ButtonProps> = ({ userId, onDelete }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingDelete, setLoadingDelete] = useState(false);
  const t = useTranslations("SettingPersonal");
  
    const handleOpen = () => {
      onOpen();
    }

    const handleDelete = async () => {
      setLoadingDelete(true)
      let result = await onDelete(userId)
      if(result! == true){
        setLoadingDelete(false)
        onClose()
      }
    }

  return (
        <>
      <div className="flex flex-wrap gap-3">
        <Button  onPress={() => handleOpen()} className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15" endContent={
          <Trash2 width="25px" height="25px" />}>
        </Button>
      </div>
      <Modal 
        size={"lg"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t(`delete-user`)}</ModalHeader>
              <ModalBody>
              <div className="grid grid-rows-3 grid-flow-col gap-4">
            </div>
              
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t(`btn-close-user`)}
                </Button>
                <Button 
                  isLoading={isLoadingDelete}
                  color="danger" onPress={handleDelete}>
                  {t(`btn-delete-user`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonModalUserDelete;