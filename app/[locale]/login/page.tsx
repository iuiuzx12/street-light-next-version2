"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          projectName: "LORALOCAL",
        }),
      });

      if (res.status == 200) {
        setIsLoading(false);
        setError("สำเร็จ");
        router.push("/dashboard-period");
        router.refresh();
        
      } else {
        setIsLoading(false);
        setError("Failed to log in. Please check your credentials.");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการ login:", error);
      setError("เกิดข้อผิดพลาดในการ login");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-green-400">
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-xs w-full">
        <h1 className="text-2xl text-center font-bold mb-6">Login Page</h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
          onClick={handleLogin}
        >
          {isLoading ? "กำลังเข้าระบบ..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
