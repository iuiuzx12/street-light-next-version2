"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Logout = async () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
    });

    if (res.status == 200) {
      setIsLoading(false);
      setError("สำเร็จ");
      router.push("/login");
      router.refresh();

    } else {
      setIsLoading(false);
      setError("Failed to log in. Please check your credentials.");
    }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-green-400"></div>
  );
};

export default Logout;
