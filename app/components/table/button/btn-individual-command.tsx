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
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

import { Power, SendIcon, StopCircle } from "lucide-react";
interface Props {
  deviceId: string;
}

const ButtonModelIndividualCommand: React.FC<Props> = ({ deviceId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [percentage, setPercentage] = useState(50);
  const [value, setValue] = React.useState(0);
  var [isValueSlider, setValueSlider] = useState<number | number[] | undefined>(
    80
  );

  const [seconds, setSeconds] = useState<number>(0);
  const [countCommand, setCountCommand] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setSeconds(0);
    setIsRunning(true);
    //setData([]);
    const id = setInterval(() => {
      setSeconds((prev) => prev + 10);
      console.log(seconds)
    }, 1000);
    setIntervalId(id);
    console.log(id);
    return id;
  }, [intervalId, isRunning, seconds]);

  const stopTimer = useCallback(
    (id: NodeJS.Timeout | null) => {
      if (id) {
        clearInterval(id);
        setIsRunning(false);
      }
    },
    [intervalId, isRunning]
  );

  const resetTimer = (id: NodeJS.Timeout | null) => {
    setCountCommand(countCommand+1)
    setSeconds(0);
    return 0;
  };

  const handleOpenDetail = async () => {
    onOpen();
    setSeconds(0);
    setCountCommand(0);
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
    stopTimer(intervalId);
  };

  const handleInputChange = async (newValue: string) => {
    //setdataSearchGroup(newValue); 
    //onListDevice(newValue)
    //console.log(newValue)
    //setFilterValue(newValue);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          isIconOnly
          isDisabled
          size="md"
          radius="md"
          className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
          aria-label="Percentage Button"
        >
          {percentage}%
        </Button>
        <Button
          isIconOnly
          onClick={() => handleOpenDetail()}
          className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15"
        >
          <Power />
        </Button>
      </ButtonGroup>

      <Modal size={"sm"} isOpen={isOpen} onClose={handleCloseDetail}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex w-full flex-col">
                  <h1 className="text-center">{"Control"}</h1>
                 
                  <div className="grid grid-cols-6 gap-4">

                  <Slider
                      step={10}
                      size="md"
                      label={"Brightness"}
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
                      <h1>{"Send"}</h1>
                      <SendIcon> </SendIcon>
                    </Button>

                    <Button
                      isDisabled={!isRunning}
                      onClick={handleStop}
                      aria-label="send"
                      className="col-end-7 col-span-2 bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg w-full"
                      size="md"
                      //onClick={() => handleSend()}
                    >
                      <h1>{"Stop"}</h1>
                      <StopCircle> </StopCircle>
                    </Button>

                    <Progress
                      aria-label="Downloading..."
                      className="col-start-1 col-end-7 w-full"
                      color="success"
                      label={"Count : "+countCommand}
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
