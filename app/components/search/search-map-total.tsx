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

interface AProps {
  onSendData: (data: {
    id: string;
    gateway_id: string;
    imsi: string;
    lat: string;
    lng: string;
    status: string;
    type_schedule: string;
    using_sensor: string;
    last_power: string;
  }) => void;
}

const SeachMapTotal: React.FC<AProps> = ({ onSendData }: any) => {
  const [typeSearch, setTypeSearch] = useState("group");
  const [typeStatus, setTypeStatus] = useState("all");
  const [dataType, setDataType] = useState([]);
  const [dataSearch, setDataSearch] = useState("ALL");
  
  const fetchType = async (type: any) => {
    const res = await fetch("/api/get-data-" + type, {
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
    const res = await fetch("/api/get-lat-long", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_search: typeSearch,
        list_value: JSON.stringify([dataSearch]),
        status_lamp: typeStatus,
        type_gps: "mobile_pole_rtu",
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      onSendData(result.data)
    } else {

    }
  };

  useEffect(() => {
    fetchType("group");
  }, []);

  const handleChange = async (newValue: any) => {
    setTypeSearch(newValue.target.defaultValue);
    await fetchType(newValue.target.defaultValue);
  };

  const handleChangeStatus = async (newValue: any) => {
    setTypeStatus(newValue.target.defaultValue);
  };

  const handleChangeType = async (newValue: any) => {
    setDataSearch(newValue);
  };

  const onClick = async () => {
    fetchLatLong();
  };


  return (
    <Card className="m-1">
      <CardBody>
        <div className="grid grid-cols-4 gap-10">
          <RadioGroup
            label="Select Type"
            orientation="horizontal"
            value={typeSearch}
            onChange={handleChange}
          >
            <Radio value="group">Group</Radio>
            <Radio value="imsi">IMSI</Radio>
            <Radio value="street-name">Street Name</Radio>
          </RadioGroup>

          <RadioGroup
            label="Select Status"
            orientation="horizontal"
            value={typeStatus}
            onChange={handleChangeStatus}
          >
            <Radio value="all">All</Radio>
            <Radio value="4">orange</Radio>
            <Radio value="5">blue</Radio>
          </RadioGroup>

          <Autocomplete
            
            label="Favorite Animal"
            placeholder="Search an animal"
            className="max-w-xs"
            value={dataSearch}
            onInputChange={handleChangeType}
            
          >
            {dataType.map((data: any) => (
              <AutocompleteItem key={data.key}>{data.value}</AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            radius="full"
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
            onClick={onClick}
          >
            Button
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SeachMapTotal;
