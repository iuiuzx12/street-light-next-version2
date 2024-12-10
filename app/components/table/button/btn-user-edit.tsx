import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Input, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { UserPen ,Eye , EyeClosed } from 'lucide-react';
import { ListUser } from "@/app/interface/personal";
import { useTranslations } from "next-intl";

interface AProps {
  detailUser : ListUser
  dataListRule : []
  onEditUser: (
    personalId : string, 
    firstname : string, 
    lastname : string,
    username : string, 
    password : string,
    role : string,
    type : string ) => void;
}

const ButtonModalUserEdit: React.FC<AProps> = ({ detailUser , dataListRule , onEditUser }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isLoadingSave, setLoadingSave] = useState(false);
  const [isInvalidPass, setInvalidPass] = useState(false);
  const [dataIdpersonal , setIdpersonal] = useState('')
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
    setFname(detailUser.first_name);
    setLname(detailUser.last_name);
    setUserName(detailUser.personal_username);
    setPass(detailUser.personal_password);
    setRoleId(detailUser.roles_id);
    setIdpersonal(detailUser.personal_id);
    setInvalidPass(false)
  }

  const handleSave = async () => {
    setLoadingSave(true)
    let result = await onEditUser(dataIdpersonal ,dataFname,dataLname,dataUserName,dataPass, dataRoleId, "EDIT")
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
  
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button  onPress={() => handleOpen()} className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15" endContent={
          <UserPen width="25px" height="25px" />}>
          {t(`btn-edit-user`)}
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
              <ModalHeader className="flex flex-col gap-1">{t(`edit-user`)}</ModalHeader>
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
                isDisabled={true}
                errorMessage={t(`wrong-username`)}
                value={dataUserName}  />

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
                {dataListRule.map((data: any) => (
                  <AutocompleteItem key={data.key}>{data.value}</AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
              
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                {t(`btn-close-user`)}
                </Button>
                <Button 
                  isDisabled={
                    dataFname == '' || 
                    dataLname == '' ||
                    dataPass == '' ||
                    dataRoleId == '' ||
                    dataUserName == '' ||
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

export default ButtonModalUserEdit;