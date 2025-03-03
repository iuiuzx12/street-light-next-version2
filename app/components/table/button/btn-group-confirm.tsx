import React, {useState } from "react";
import { Button} from "@heroui/react";
import { Trash , CheckCheck, Loader, CircleX } from "lucide-react";


interface Props {
  value : string
  disabled : boolean
  onPress: (confirmed: boolean) => void; 
  onConfirm: (confirmed: boolean, value : string) => void; 
}

const ButtonConfirm: React.FC<Props> = ({ disabled, onPress, onConfirm , value }) => {
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
        aria-label="Confirming Delete"
        size="md"
        radius="md"
        className="bg-gradient-to-tr from-red-500 to-red-400 text-white shadow-lg -m-15"
      >
        
        {isConfirming ? <CheckCheck/> : <Trash/>}
      </Button>
      {isConfirming && (
        <div>
          <Button 
            isIconOnly 
            onPress={handleCancel}
            aria-label="Confirming Delete"
            size="md"
            radius="md"
            className="bg-gradient-to-tr from-green-500 to-green-400 text-white shadow-lg -m-15"
            > <CircleX/> </Button>
        </div>
      )}
    </div>
  );
}

export default ButtonConfirm;