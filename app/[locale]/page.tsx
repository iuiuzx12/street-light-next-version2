"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard-period');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4">
        <Loading/>
      </div>
    </div>
  );
}