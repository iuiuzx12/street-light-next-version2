import { Check ,OctagonX , } from 'lucide-react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ButtonProps {
  disabled : boolean
  userId: string;
  usable : string;
  onSetUsable : (userId : string, status : string) => void;
}

const ButtonModalUserUsing: React.FC<ButtonProps> = ({disabled, userId, usable, onSetUsable }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingSet, setLoadingSet] = useState(false);
  const t = useTranslations("SettingPersonal");
    const handleOpen = () => {
        onOpen();
    }

    const handleSet = async () => {
        setLoadingSet(true)
        let result = await onSetUsable(userId, usable == "Y" ? "N" : "Y")
        if(result! == true){
            setLoadingSet(false)
          onClose()
        }
      }

  return (
        <>
      <div className="flex flex-wrap gap-3">
        {usable == "Y" ? <Button isDisabled={!disabled} onPress={() => handleOpen()} className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15" endContent={
          <Check width="25px" height="25px" />}>
        </Button> : <Button isDisabled={!disabled}  onPress={() => handleOpen()} className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15" endContent={
          <OctagonX width="25px" height="25px" />}>
        </Button>}
        
      </div>
      <Modal 
        size={"lg"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t(`change-status`)}</ModalHeader>
              <ModalBody>
              <div className="grid grid-rows-3 grid-flow-col gap-4">
            </div>
              
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t(`btn-close-user`)}
                </Button>
                <Button 
                    isLoading={isLoadingSet}
                    color="danger" onPress={handleSet}>
                  {t(`btn-yes-user`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonModalUserUsing;