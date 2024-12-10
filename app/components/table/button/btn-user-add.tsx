import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ListUser } from "@/app/interface/personal";
import { UserPlus, Eye , EyeClosed} from 'lucide-react';
import { useTranslations } from "next-intl";

interface AProps {
  dataRule : []
  onSendData: (
    personalId : string, 
    firstname : string, 
    lastname : string,
    username : string, 
    password : string,
    role : string ,
    type : string ) => void;
}

const ButtonModalUserAdd: React.FC<AProps> = ({ dataRule , onSendData }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingSave, setLoadingSave] = useState(false);
  const [isInvalidUser, setInvalidUser] = useState(true);
  const [isInvalidPass, setInvalidPass] = useState(true);
  const [dataFname , setFname] = useState('')
  const [dataLname , setLname] = useState('')
  const [dataUserName , setUserName] = useState('')
  const [dataPass , setPass] = useState('')
  const [dataRole , setRole] = useState('1')
  const [dataRoleId , setRoleId] = useState('1')
  const t = useTranslations("SettingPersonal");
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleOpen = () => {
    onOpen();
    setFname('');
    setLname('');
    setUserName('');
    setPass('');
    setRole('');
    setInvalidPass(true)
    setInvalidUser(true)
    console.log(dataRule)
  }

  const handleSave = async () => {
    setLoadingSave(true)
    let result = await onSendData("", dataFname,dataLname,dataUserName,dataPass, dataRoleId ,"ADD")
    if(result! == true){
      setLoadingSave(false)
      onClose()
    }
  }

  const handleChangeFname = (event : any) =>{
    setFname(event.target.value)
  }
  const handleChangeLname = (event : any) =>{
    setLname(event.target.value)
  }
  const handleChangeUserName = (event : any) =>{
    setUserName(event.target.value)
    fetchCheckUserName(event.target.value)
  }
  const handleChangesetPass = (event : any) =>{
    setPass(event.target.value)
    if(event.target.value.length > 7){
      setInvalidPass(false)
    }else{
      setInvalidPass(true)
    }
  }
  const handleChangeRole = (role : any) =>{
    setRole(role)
  }
  const handleChangeRoleId = (roleId : any) =>{
    setRoleId(roleId)
  }

  const fetchCheckUserName = async (dataUser : any) => {

    const res = await fetch("/api/personal/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        personal_username: dataUser,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      console.log(result.data)
      if(result.data == "0"){
        setInvalidUser(false)
        return true;
      }
      else{
        setInvalidUser(true)
        return false;
      }
      
    } else {
      setInvalidUser(false)
      return false;
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button  onPress={() => handleOpen()} className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15" endContent={
          <UserPlus width="25px" height="25px" />}>
          {t(`btn-add-user`)}
        </Button>
      </div>
      <Modal 
        size={"lg"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t(`btn-add-user`)}</ModalHeader>
              <ModalBody>
              <div className="grid grid-rows-3 grid-flow-col gap-4">
              <Input 
                type="text" 
                label={t(`f-name`)} 
                placeholder={t(`f-name-placeholder`)} 
                value={dataFname} 
                onChange={handleChangeFname} />

              <Input 
                type="text" 
                label={t(`l-name`)} 
                placeholder={t(`l-name-placeholder`)} 
                value={dataLname} 
                onChange={handleChangeLname} />

              <Input 
                type="text" 
                label={t(`username`)} 
                placeholder={t(`username-placeholder`)} 
                isInvalid={isInvalidUser}
                errorMessage={t(`wrong-username`)}
                value={dataUserName} 
                onChange={handleChangeUserName} />

              <Input
                label={t(`password`)}
                variant="bordered"
                placeholder={t(`password-placeholder`)}
                isInvalid={isInvalidPass}
                errorMessage={t(`wrong-password`)}
                onChange={handleChangesetPass}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                      <Eye className="text-2xl text-default-400 pointer-events-none" width="25px" height="25px" />
                        ) : (
                      <EyeClosed className="text-2xl text-default-400 pointer-events-none" width="25px" height="25px" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-xs"
              />

              <Autocomplete
                label={t(`role`)}
                placeholder={t(`role`)}
                className="max-w-xs"
                defaultSelectedKey={dataRoleId}
                onSelectionChange={handleChangeRoleId}
                onInputChange={handleChangeRole}
            
              >
                {dataRule.map((data: any) => (
                  <AutocompleteItem key={data.key}>{data.value}</AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
              
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  isDisabled={
                    dataFname == '' || 
                    dataLname == '' ||
                    dataPass == '' ||
                    dataRoleId == '' ||
                    dataUserName == '' ||
                    isInvalidUser == true ||
                    isInvalidPass == true ? true : false} 
                  isLoading={isLoadingSave} color="primary" onPress={handleSave} >
                  {t(`btn-save-user`)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ButtonModalUserAdd;