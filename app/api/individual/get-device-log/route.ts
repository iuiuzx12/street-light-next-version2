"use server";

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

export async function POST(req: Request, res: Response) {
  try {
    var token = cookies().get("token");
    const data = await req.json();
    const response = await fetch(
      process.env.API_URL + "/StreetLight/getDataLogStreetLightDynamo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.value,
        },
        body: JSON.stringify(data),
      }
    );

    const dataResponse = await response.json();
    if (dataResponse.result === false) {
      return NextResponse.json("401", {
        status: 401,
      });
    } else {

      var dataArrayWithId = Object.entries(dataResponse.dataReturn).map(([id, value] : any) => ({
        id: id,
        ...value
      })).sort((a, b) => parseInt(b.ts) - parseInt(a.ts));

      const totalW = dataArrayWithId.reduce((sum, item) => sum + ( parseFloat(item.w) || 0), 0);
      const totalI = dataArrayWithId.reduce((sum, item) => sum + (parseFloat(item.i) || 0), 0);
      const totalV = dataArrayWithId.reduce((sum, item) => sum + (parseFloat(item.v) || 0), 0);

      const averageWatt = totalW / dataArrayWithId.length;
      const averageVolt = totalV / dataArrayWithId.length;
      const averageI = totalI / dataArrayWithId.length;
      return NextResponse.json(
        {
          data: dataArrayWithId,
          averageWatt: averageWatt.toFixed(2).toString(),
          averageVolt: averageVolt.toFixed(2).toString(),
          averageI: averageI.toFixed(2).toString(),
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
