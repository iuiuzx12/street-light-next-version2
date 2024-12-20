import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Switch,
} from "@nextui-org/react";

import { X, Check, Power, PowerOff, Sunset, Timer ,Hand } from "lucide-react";
import { useTranslations } from "next-intl";
interface Props {
  deviceId: string;
  typeMode : string;
  using : boolean;
}

const ButtonModeAuto: React.FC<Props> = ({ deviceId , typeMode , using }) => {
  const t = useTranslations("ControlIndividual");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = React.useState(using);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState("");
  const handleOpenDetail = async () => {
    setLoading(false)
    setSuccess("")
    console.log(selected)
    onOpen();
  };

  const handleCancel = () => {
    setLoading(false)
    setSuccess("")
    onClose();
  };

  const handleConfirmChange = () => {
    fetchSetmode()
    setLoading(true)
    setSuccess("")
    // setSelected(!selected);
    // onClose();
  };

  const fetchSetmode =  async () : Promise<any> => {
      try {
        const res = await fetch("/api/command/set-mode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "API-Key": "1234",
          },
          body: JSON.stringify({
            "mode": selected === true ? "manual" : typeMode === "manual" ? "light" : typeMode,
            "imsi": deviceId,
            "wait_time": "10"
          }),
        });
  
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
    
        const result = await res.json();
        if(result.data === ""){
          setLoading(false)
          setSuccess("false")
          //onClose();

        }else{
          setLoading(false)
          setSuccess("true")
          setSelected(!selected);
          onClose();

        }
        //const data: ListDevice[] = result.data;
        return "data";
      } catch (error) {
        console.error('Error fetching users:', error);
        //const data: ListDevice[] = []
        return "data";
      }
    };


  return (
    <>
            <Switch
                isSelected={selected}
                onClick={handleOpenDetail}
                color="success"
                endContent={<PowerOff color="white"/>}
                size="lg"
                startContent={<Power color="white"/>}
                thumbIcon={  typeMode === "time" ? <Timer color="gray"/> : typeMode === "manual"  ? <Hand color="gray"/> : <Sunset color="gray"/> }
              ></Switch>

      <Modal size={"xs"} isOpen={isOpen} backdrop="blur" hideCloseButton={true} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
              <h1 className="text-center">{t(`device-id`)} { deviceId } ?</h1>
              <div className="grid grid-cols-2 gap-2"> 
                
                <Button isLoading={isLoading} className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15" onClick={handleConfirmChange}> {isLoading === true ? "" : < Check/>}  </Button>
                <Button className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15 w-full" onClick={handleCancel}>< X/></Button>
              
                </div>
              </ModalBody>
              <ModalFooter className="self-center">
                <h1 className={isSuccess === "false" ? "text-red-500" : "text-green-500"}>{isSuccess === "false" ? t(`unsuccessful`) : isSuccess === "" ? "" : t(`successes`)}</h1>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ButtonModeAuto;
