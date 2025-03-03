import React, { useState } from "react";
import { Button} from "@heroui/react";
import { Save , CheckCheck, Loader , CircleX } from "lucide-react";

interface Props {
  disabled : boolean
  value : string
  onPress: (click: boolean) => void; 
  onConfirm: (confirmed: boolean, value : string) => void; 
}

const ButtonConfirmEdit: React.FC<Props> = ({ disabled , onPress , onConfirm , value }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (isConfirming) {
      onConfirm(true, value);
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      onPress(true);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
    onPress(false); 
  };

  return (
    <div className="grid grid-flow-col auto-cols-max gap-1">
      <Button 
        isIconOnly 
        isDisabled={!disabled}
        onPress={handleClick}
        aria-label="Confirming Edit"
        size="md"
        radius="md"
        className="bg-gradient-to-tr from-green-500 to-green-400 text-white shadow-lg -m-15"
      >
        
        {isConfirming ? <CheckCheck/> : <Save/>}
      </Button>
      {isConfirming && (
        <div>
          <Button 
            isIconOnly 
            onPress={handleCancel}
            aria-label="Confirming Edit"
            size="md"
            radius="md"
            className="bg-gradient-to-tr from-red-500 to-red-400 text-white shadow-lg -m-15"
            > <CircleX/> </Button>
        </div>
      )}
    </div>
  );
};

export default ButtonConfirmEdit;