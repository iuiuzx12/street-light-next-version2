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
interface Props {
  deviceId: string;
}

const ButtonModelListIndividualLog: React.FC<Props> = ({ deviceId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenDetail = async () => {
   
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
                <h1>{"FFFF"}</h1>
                        <div className="col-span-full">
                          
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
