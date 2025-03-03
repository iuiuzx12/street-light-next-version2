import React, { useState } from "react";
import {Button, useDisclosure} from "@heroui/react";
import { useTranslations } from "next-intl";
import { RefreshCcw } from "lucide-react";
interface Props {
    imsi: string;
    mode: string;
    lastUpdate: string;
    status: string;
    resendCommad : (imsi: string , mode : string , lastUpdate : string) => Promise<string>;
    setResponse : (imsi: string) => void;
    children?: React.ReactNode;
}
const ButtonResend: React.FC<Props> = ({ imsi ,mode ,lastUpdate , status ,resendCommad , setResponse }) => {
  const [isLoadingResend, setLoadingResend] = useState(false);

  const Resend = async () => {
    setLoadingResend(true)
    let result = await resendCommad(imsi, mode , lastUpdate)
    if(result !== ""){
        setLoadingResend(false)
        setResponse(imsi)
    }
    else{
      setLoadingResend(false)
    }
  }
  return (
    <>
      <Button
            isIconOnly
            isLoading={isLoadingResend}
            isDisabled={status == "respone" ? true : false}
            aria-label="resend command"
            size="md"
            radius="md"
            onPress={Resend}
            className={status == "respone" ? "bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg -m-15" : "bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15"} 
          >
            <RefreshCcw />
          </Button>
    </>
  );
}
export default ButtonResend;