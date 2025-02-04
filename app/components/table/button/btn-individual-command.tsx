import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Slider,
  ButtonGroup,
  Progress,
} from "@nextui-org/react";

import {MoonIcon, SunIcon , Power, SendIcon, StopCircle } from "lucide-react";
import { useTranslations } from "next-intl";
interface Props {
  disabled: boolean;
  gatewayId: string;
  deviceId: string;
  command: string;
  brightness: number;
}

const ButtonModelIndividualCommand: React.FC<Props> = ({disabled , gatewayId, deviceId ,command , brightness}) => {
  const t = useTranslations("ControlIndividual");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCommand, setCommand] = useState(command);
  var [isValueSlider, setValueSlider] = useState<number | number[] | undefined>(
    brightness
  );

  const [seconds, setSeconds] = useState<number>(0);
  const [countCommand, setCountCommand] = useState<number >(0);
  const [isControl, setControl] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "LOCAL";

  const fetchCommand =  useCallback( async (imsi : string , command : string, dim : string) => {
    const res = await fetch("/api/command/control", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_open: "imsi",
        imsi: imsi,
        subscribe: projectId +"/RESPONSE/" + imsi,
        wait_time: "10",
        command_type: command,
        dim_percent: dim,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      if(result.data === ""){
        setControl(false)
        return false
      }
      else{
        setControl(true)
        setSeconds(100)
        stopTimer(intervalId)
        return true
      }
      
    } else {
      setControl(false)
      return false
    }
  }, [isControl, intervalId, isValueSlider]);

  const startTimer = useCallback(() => {
    setSeconds(0);
    setIsRunning(true);
    fetchCommand(deviceId, (isValueSlider === 0 ? "0" : "1") , (isValueSlider === 0 ? "1" : isValueSlider + "" ) )
    //setData([]);
    const id = setInterval(() => {
      setSeconds((prev) => prev + 10);
      //console.log(seconds)
    }, 1000);
    setIntervalId(id);
    //console.log(id);
    return id;
  }, [intervalId, isRunning, seconds, isValueSlider]);

  const stopTimer = useCallback(
    (id: NodeJS.Timeout | null) => {
      if (id) {
        clearInterval(id);
        setIsRunning(false);
      }
    },
    [intervalId, isRunning ,isControl]
  );

  const resetTimer = (id: NodeJS.Timeout | null) => {
    setCountCommand(countCommand+1)
    setSeconds(0);
    if(isControl === false){
      fetchCommand(deviceId, (isValueSlider === 0 ? "0" : "1") , (isValueSlider === 0 ? "1" : isValueSlider + "" ) )
    }
    else{
      
    }
    return 0;
  };

  const handleOpenDetail = async () => {
    onOpen();
    setSeconds(0);
    setCountCommand(0);
    setControl(false)
    stopTimer(intervalId)
  };

  const handleCloseDetail = async () => {
    onClose();
    setSeconds(0);
    setCountCommand(0);
    stopTimer(intervalId)
  };

  const handleCommand = async () => {
    onOpen();
    startTimer();
  };

  const handleStop = async () => {
    stopTimer(intervalId);
  };

  var handleSlider = (value: number | number[]) => {
    setValueSlider(value);
    setCommand(value.toString())
    stopTimer(intervalId);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          isIconOnly
          isDisabled
          size="md"
          radius="md"
          className={isCommand === '0' ? "bg-gradient-to-tr text-white shadow-lg -m-15 from-gray-500 to-gray-300" : "bg-gradient-to-tr text-white shadow-lg -m-15 from-green-500 to-green-300"}
          aria-label="Percentage Button"
        >
          {isValueSlider === 1 ? command === "0" ? 0 : 1 : isValueSlider}%
        </Button>
        <Button
          isIconOnly
          isDisabled={!disabled}
          onClick={() => handleOpenDetail()}
          className={isCommand === '0' ? "bg-gradient-to-tr text-white shadow-lg -m-15 from-gray-500 to-gray-300" : "bg-gradient-to-tr text-white shadow-lg -m-15 from-green-500 to-green-300"}
        >
          {isCommand === '0' ? <MoonIcon/> : <SunIcon />}
          
        </Button>
      </ButtonGroup>

      <Modal size={"sm"} isOpen={isOpen} onClose={handleCloseDetail}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex w-full flex-col">
                  <h1 className="text-center">{t(`control`)}</h1>
                 
                  <div className="grid grid-cols-6 gap-4">

                  <Slider
                      step={10}
                      size="md"
                      label={t(`brightness`)}
                      defaultValue={isValueSlider}
                      onChange={handleSlider}
                      className="col-span-6"
                      classNames={{
                        base: "max-w-md gap-2",
                        track: "border-s-secondary-100",
                        filler:
                          "bg-gradient-to-r from-secondary-100 to-secondary-600",
                      }}
                      renderThumb={(props) => (
                        <div
                          {...props}
                          className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                        >
                          <span className="transition-transform bg-gradient-to-br shadow-small from-secondary-100 to-secondary-600 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
                        </div>
                      )}
                    />

                    <Button
                      isLoading={isRunning}
                      onClick={handleCommand}
                      aria-label="send"
                      className="col-start-1 col-end-3 bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg w-full"
                      size="md"
                      //onClick={() => handleSend()}
                    >
                      <h1>{t(`send`)}</h1>
                      <SendIcon> </SendIcon>
                    </Button>

                    <Button
                      isDisabled={!isRunning}
                      onClick={handleStop}
                      aria-label="stop"
                      className="col-end-7 col-span-2 bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg w-full"
                      size="md"
                      //onClick={() => handleSend()}
                    >
                      <h1>{t(`stop`)}</h1>
                      <StopCircle> </StopCircle>
                    </Button>

                    <Progress
                      aria-label="Downloading..."
                      className="col-start-1 col-end-7 w-full"
                      color="success"
                      label={ t(`count`) + "" + countCommand +" "+ (isControl === true ? t(`successes`) : t(`unsuccessful`))}
                      showValueLabel={true}
                      size="md"
                      value={seconds === 100 ? resetTimer(intervalId) : seconds}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default ButtonModelIndividualCommand;
