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
    console.log("logout");
    var token = cookies().set("token","logout")
    //router.refresh();
    return NextResponse.json("200", {
        status: 200,
      });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
}