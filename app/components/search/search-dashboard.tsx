import { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  Card,
  CardBody,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
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
  const [dataType, setDataType] = useState([]);
  const [dataSearch, setDataSearch] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchType = async (type: any) => {
    const res = await fetch("/api/service/get-data-" + type, {
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
    setDataType(result.data || []);
  };

  const fetchLatLong = async () => {
    const res = await fetch("/api/map/get-lat-long", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_search: typeSearch,
        list_value: JSON.stringify([dataSearch]),
        status_lamp: typeStatus,
        type_gps: process.env.NEXT_PUBLIC_MAP_TYPE,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      //onSendData(result.data)
      setIsLoading(false)
    } else {

    }
  };

  useEffect(() => {
    fetchType("group");
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
    await fetchType(newValue.target.defaultValue);
  };

  const handleChangeStatus = async (newValue: any) => {
    setTypeStatus(newValue.target.defaultValue);
  };

  const handleChangeType = async (newValue: any) => {
    setDataSearch(newValue);
  };

  const onClick = async () => {
    setIsLoading(true)
    fetchLatLong();
  };


  return (
    <Card className="m-1">
      <CardBody >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <RadioGroup
            label={t(`select-type`)}
            orientation="horizontal"
            value={typeSearch}
            onChange={handleChange}
          >
            <Radio value="group">{t(`select-group`)}</Radio>
            <Radio value="imsi">{t(`select-imsi`)}</Radio>
            <Radio value="street-name">{t(`select-street-name`)}</Radio>
          </RadioGroup>

          <RadioGroup
            label={t(`select-status`)}
            orientation="horizontal"
            value={typeStatus}
            onChange={handleChangeStatus}
          >
            <Radio value="all">{t(`select-all`)}</Radio>
            <Radio value="4">{t(`select-broken`)}</Radio>
            <Radio value="5">{t(`select-disconnection`)}</Radio>
          </RadioGroup>

          <Autocomplete
            
            label={typeSearchLabel}
            placeholder={t(`btn-search`)}
            className="max-w-xs"
            value={dataSearch}
            onInputChange={handleChangeType}
            
          >
            {dataType.map((data: any) => (
              <AutocompleteItem key={data.key}>{data.value}</AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            isLoading={isLoading}
            radius="full"
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
            onClick={onClick}
          >
            {t(`btn-search`)}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SeachDashboard;
