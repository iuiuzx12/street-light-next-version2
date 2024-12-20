import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
} from "@nextui-org/react";

import { Lightbulb, RefreshCcw } from "lucide-react";
import { escape } from "querystring";
interface Props {
    gatewayId: string;
    deviceId: string;
    watt: string;
}

const ButtonIndividualPower: React.FC<Props> = ({gatewayId, deviceId , watt}) => {

  const [value, setValue] = React.useState(0);
  var [isWatt, setWatt] = useState<string>(watt);

  const [seconds, setSeconds] = useState<number>(0);
  const [countCommand, setCountCommand] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  

  const generateRandomToken = (length : number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomToken = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomToken += chars[randomIndex];
    }
    return randomToken;
  };

  const fetchReadPower = async () => {
    setLoading(true)
    const message = {
      Type : "GetPower",
      TOKEN : generateRandomToken(15)
    }
    const res = await fetch("/api/command/get-data-power", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        topic: gatewayId + "/" + deviceId,
        message: JSON.stringify(message),
        subscribe: process.env.NEXT_PUBLIC_PROJECT_ID + "/" + deviceId,
        wait_time: "10"
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
        if(result.data != ""){
            setWatt(JSON.parse(result.data).W)
        }
        else{
            setWatt("?")    
        }
        setLoading(false)
        return true
    } else {
        setLoading(false)
        setWatt("?")
        return false
    }
  };

  const handleInputChange = async (newValue: string) => {

  };

  return (
    <>
      <ButtonGroup>
        <Button
          //isIconOnly
          isDisabled
          size="md"
          className="w-32 justify-start"
          radius="md"
          //className={command === '0' ? "bg-gradient-to-tr text-white shadow-lg -m-15 from-red-500 to-red-300" : "bg-gradient-to-tr text-white shadow-lg -m-15 from-green-500 to-green-300"}
          aria-label="Power Button"
        >
            <Lightbulb color="blue"/>
          {isWatt} W
          
        </Button>
        <Button
          isIconOnly
          isLoading={isLoading}
          onClick={() => fetchReadPower()}
          className="bg-gradient-to-tr text-white shadow-lg -m-15 from-blue-500 to-blue-300"
        >
          <RefreshCcw />
        </Button>
      </ButtonGroup>
    </>
  );
};
export default ButtonIndividualPower;
