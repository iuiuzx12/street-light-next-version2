"use server";

import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req : any) {
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
export async function POST(req: Request , res : Response) {
  try {
    const data = await req.json();
    const response = await fetch ('http://localhost:8012/StreetLight/accountLogin' , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    });

    const dataResponse = await response.json();
    //console.log(dataResponse.result);
    if(dataResponse.result === false){
      return NextResponse.json("401", {
        status: 401,
      });
    }else{
      const oneDay = 24 * 60 * 60 * 1000
      cookies().set('token', dataResponse.dataReturn, { expires: Date.now() + oneDay })
      return NextResponse.json("200", {
        status: 200,
      });
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