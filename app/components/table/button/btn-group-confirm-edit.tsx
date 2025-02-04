import React, { useState } from "react";
import { Button} from "@nextui-org/react";
import { Save , CheckCheck, Loader , CircleX } from "lucide-react";

interface Props {
  disabled : boolean
  value : string
  onClick: (click: boolean) => void; 
  onConfirm: (confirmed: boolean, value : string) => void; 
}

const ButtonConfirmEdit: React.FC<Props> = ({ disabled , onClick , onConfirm , value }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (isConfirming) {
      onConfirm(true, value);
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      onClick(true);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
    onClick(false); 
  };

  return (
    <div className="grid grid-flow-col auto-cols-max gap-1">
      <Button 
        isIconOnly 
        isDisabled={!disabled}
        onClick={handleClick}
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
            onClick={handleCancel}
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