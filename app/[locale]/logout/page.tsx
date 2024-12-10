"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Logout = async () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupAll = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/logout' ,
        {
          method: "POST",
          body: JSON.stringify({})
        }); 
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setIsLoading(false);
      setError("สำเร็จ");
      router.push("/login");
      router.refresh();
    
      //users.push(newUser);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching users:', error);
      return false; 
    }
  };

  useEffect(() => {
    fetchGroupAll();
  }, []);
  

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-200"></div>
  );
};

export default Logout;
