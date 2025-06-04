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

export async function POST(req: Request) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const cookieStore = await cookies();
    var token = cookieStore.get("token");
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
    const dataResponse = await response.json();
    const dataLatLong = await responseLatLong.json();
    if (dataResponse.result === false) {
      return NextResponse.json("401", {
        status: 401,
      });
    } else {

      const mergedData = dataResponse.dataReturn.map((listDevice : ListDevice) => {
        const dataLatlong = dataLatLong.dataReturn.find((listLatLong : ListLatLong) => listLatLong.imsi === listDevice.imsi);
        if (dataLatlong) {
          let icon_map;
          switch (dataLatlong.status) {
            case "0":
              if (
                dataLatlong.type_schedule !== "manual" &&
                dataLatlong.using_sensor.toLowerCase() !== "false"
              ) {
                icon_map = 0;
              } else {
                icon_map = 1;
              }
              break;
            case "1":
              if (
                dataLatlong.type_schedule !== "manual" &&
                dataLatlong.using_sensor.toLowerCase() !== "false"
              ) {
                icon_map = 4;
              } else {
                icon_map = 5;
              }
              break;
            case "2":
              if (
                dataLatlong.type_schedule !== "manual" &&
                dataLatlong.using_sensor.toLowerCase() !== "false"
              ) {
                icon_map = 0;
              } else {
                icon_map = 1;
              }
              break;
            case "3":
              if (parseInt(dataLatlong.last_power) > 5) {
                icon_map = 6;
              } else {
                icon_map = 2;
              }
              break;
            case "4":
              if (
                dataLatlong.type_schedule !== "manual" &&
                dataLatlong.using_sensor.toLowerCase() !== "false"
              ) {
                icon_map = 10;
              } else {
                icon_map = 10;
              }
              break;
            case "5":
              if (parseInt(dataLatlong.last_power) > 5) {
                icon_map = 7;
              } else {
                icon_map = 3;
              }
              break;
            case "6":
              if (parseInt(dataLatlong.last_power) > 5) {
                icon_map = 7;
              } else {
                icon_map = 3;
              }
              break;
          }

          return { ...listDevice, lat: dataLatlong.lat, long: dataLatlong.lng , status : icon_map};
        }
        return listDevice;
      });
      
      return NextResponse.json(
        {
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
