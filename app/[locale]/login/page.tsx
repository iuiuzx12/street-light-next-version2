"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, User, Eye, EyeClosed } from "lucide-react";
import LangSwitcher from "@/app/components/lang-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Assuming Label might be needed, though problem description says use simple <label> for now
// import { Label } from "@/components/ui/label";


const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Login");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: any) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/login/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": "1234",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          projectName: process.env.NEXT_PUBLIC_PROJECT_ID,
        }),
      });

      if (res.status == 200) {
        setError(t(`successful`));
        router.push("/dashboard-period");
        router.refresh();
        //setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(t(`sign-in-failed`));
      }
    } catch (error) {
      console.error("error login:", error);
      setError(t(`sign-in-error`));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-200">
      <div className="bg-gradient-to-r from-blue-300 to-blue-200 shadow-lg rounded-lg p-8 max-w-xs w-full text-center">
        <form>
          <h1 className="text-2xl text-center font-bold mb-6 text-slate-700">
            {t(`sign-in`)}
          </h1>
          <div className="mb-4 space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left mb-1">{t(`username`)}</label>
            <div className="relative flex items-center">
              <Input
                id="username"
                type="text"
                placeholder={t(`username-placeholder`)}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10" // Add padding to the right for the icon
              />
              <User
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="mb-6 space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">{t(`password`)}</label>
            <div className="relative flex items-center">
              <Input
                id="password"
                placeholder={t(`password-placeholder`)}
                onChange={(e) => setPassword(e.target.value)}
                type={isVisible ? "text" : "password"}
                className="pr-10" // Add padding to the right for the icon
              />
              <button
                className="focus:outline-none absolute right-3 top-1/2 -translate-y-1/2"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <Eye
                    className="h-5 w-5 text-gray-400"
                  />
                ) : (
                  <EyeClosed
                    className="h-5 w-5 text-gray-400"
                  />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <Button
            type="submit"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg items-center"
          >
            {isLoading ? (
              <>
                {/* You can add a spinner icon here if desired */}
                {t(`logging-in`)}
              </>
            ) : (
              <>
                {t(`btn-login`)}
                <LogIn className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
        <br></br>
        <div className="grid grid-flow-col auto-cols-max place-self-center">
          <p className="text-fuchsia-950">{t(`change-language`)}</p>
          &nbsp;
          <LangSwitcher />
        </div>
        <br></br>
        <p className="text-fuchsia-100">
          © 2024 - LOCAL Admin by L&E Lighting and Equipment Public Company
          Limited.
        </p>
      </div>
    </div>
  );
};

export default Login;
