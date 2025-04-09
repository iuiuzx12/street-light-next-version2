import { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  Card,
  CardBody,
  Button,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { ListLatLong } from "@/app/interface/map";

interface AProps {
    //onSendData: (data: ListLatLong[]) => void;
  }

const SeachDashboard: React.FC<AProps> = (
    //{ onSendData }: any
) => {
  const t = useTranslations("MapTotal");

  const [typeSearch, setTypeSearch] = useState("group");
  const [typeSearchLabel, setTypeSearchLabel] = useState(t(`select-group`));
  const [typeStatus, setTypeStatus] = useState("all");
  const [dataGroup, setDataGroup] = useState([]);
  const [dataType, setDataType] = useState([{}]);
  const [dataSearch, setDataSearch] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchGroup = async () => {
    const res = await fetch("/api/service/get-data-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        projectName: "LORALOCAL",
      }),
    });

    if (res.status == 200) {
    } else {
    }
    const result = await res.json();
    setDataGroup(result.data || []);
  };

  

  useEffect(() => {
    fetchGroup();
    setDataType([
      {"key" : "current" , "value" : "ล่าสุด"},
      {"key" : "day" , "value" : "รายวัน"},
      {"key" : "week" , "value" : "รายอาทิตย์"},
      {"key" : "month" , "value" : "รายเดือน"},
      {"key" : "quarter" , "value" : "ไตรมาส"},
      {"key" : "year" , "value" : "รายปี"}
    ])
  }, []);

  const handleChange = async (newValue: any) => {
    setTypeSearch(newValue.target.defaultValue === "street-name" ? "street_light_name" : newValue.target.defaultValue);
    if(newValue.target.defaultValue === 'group'){
      setTypeSearchLabel(t(`select-group`));
    }else if (newValue.target.defaultValue === 'imsi'){
      setTypeSearchLabel(t(`select-imsi`));
    }else if (newValue.target.defaultValue === 'street-name'){
      setTypeSearchLabel(t(`select-street-name`));
    }else{

    }
    //await fetchType(newValue.target.defaultValue);
  };

  const handleChangeStatus = async (newValue: any) => {
    setTypeStatus(newValue.target.defaultValue);
  };

  const handleChangeType = async (newValue: any) => {
    setDataSearch(newValue);
  };

  const onPress = async () => {
    setIsLoading(true)
  };


  return (
    <Card className="m-1">
      <CardBody >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          

          <Autocomplete
            
            label={typeSearchLabel}
            placeholder={t(`btn-search`)}
            className="max-w-xs"
            value={dataSearch}
            onInputChange={handleChangeType}
            
          >
            {dataGroup.map((data: any) => (
              <AutocompleteItem key={data.key} textValue={data.value}>{data.value}</AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            
            label={typeSearchLabel}
            placeholder={t(`btn-search`)}
            className="max-w-xs"
            value={dataSearch}
            onInputChange={handleChangeType}
            
          >
            {dataType.map((data: any) => (
              <AutocompleteItem key={data.key} textValue={data.value}>{data.value}</AutocompleteItem>
            ))}
          </Autocomplete>

          <DatePicker className="max-w-[284px]" label="Birth date" />

          <Button
            isLoading={isLoading}
            radius="full"
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
            onPress={onPress}
          >
            {t(`btn-search`)}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SeachDashboard;
