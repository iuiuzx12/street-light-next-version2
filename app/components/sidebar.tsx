'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthRules } from '@/app/rules';
import  MenuItem from "@/app/components/sidebar-menu";
import { cookies } from 'next/headers';

export function SideNav(data : any) {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-2 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
        >
          <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
          <span className="font-bold text-xl hidden md:flex">Logo</span>
        </Link>

        <div className="flex flex-col space-y-1 md:px-2 ">
          {AuthRules(data).map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}