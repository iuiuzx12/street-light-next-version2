"use server";

import { ListDevice } from "@/app/interface/control";
import { ListLatLong } from "@/app/interface/map";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: any) {
  try {
    return NextResponse.json(
      { error: "Failed to get admins" },
      {
        status: 500,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get admins" },
      {
        status: 500,
      }
    );
  }
}

// Notice the function definition:
export async function POST(req: Request, res: Response) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    var token = cookies().get("token");
    const data = await req.json();
    const response = await fetch(
      process.env.API_URL + "/StreetLight/getListDataGroupDetail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: JSON.stringify(data),
      }
    );

    const responseLatLong = await fetch(
      process.env.API_URL + "/StreetLight/getDataLatLong",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: JSON.stringify({
          type_search: "group",
          list_value: JSON.stringify([data.group_name]),
          status_lamp: "all",
          type_gps: "mobile_pole_rtu",
        }),
      }
    );

    console.log(data.group_name)

    const dataResponse = await response.json();
    const dataLatLong = await responseLatLong.json();
    if (dataResponse.result === false) {
      return NextResponse.json("401", {
        status: 401,
      });
    } else {

      const updatedData = dataResponse.dataReturn.map((item : ListDevice)  => {
        
        if (parseInt(item.time_stamp) < ( timestamp + 86400)) { 
          item.status = "day";
        } else if(parseInt(item.time_stamp) < ( timestamp + 3600)){
          item.status = "dis";
        } else if(parseInt(item.last_power) >= 5 ){
          item.status = "open";
        } else if(parseInt(item.last_power) < 5 ){
          item.status = "close";
        } else {
          item.status = "?";
        }
    
        return item;
      });

      const mergedData = updatedData.map((listDevice : ListDevice) => {
        const dataLatlong = dataLatLong.dataReturn.find((listLatLong : ListLatLong) => listLatLong.imsi === listDevice.imsi);
        if (dataLatlong) {
          return { ...listDevice, lat: dataLatlong.lat, long: dataLatlong.lng };
        }
        return listDevice;
      });
      
      return NextResponse.json(
        {
          //data: dataResponse.dataReturn,
          data: mergedData,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("error");
    console.log(error);
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}
