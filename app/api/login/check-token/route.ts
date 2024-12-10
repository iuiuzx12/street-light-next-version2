"use server";

import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req : any) {
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
export async function GET(req: Request , res : Response) {
  try {
    console.log("checkLogin");
    console.log("checkLogin");
    var token = cookies().get("token");
    //console.log("token")
    //console.log(token?.value)
    //const data = await req.json();
    const response = await fetch (process.env.API_URL + '/StreetLight/checkLogin' , {
      method: 'POST',
      headers: {
        "Authorization" : "Bearer " + token?.value
      },
      //body: JSON.stringify(data)
    });

    const dataResponse = await response.json();
    console.log(dataResponse);
    //console.log(dataResponse.result);
    if(dataResponse.result === false){
      return NextResponse.json("401", {
        status: 401,
      });
    }else{
      return NextResponse.json("200", {
        status: 200,
      });
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}