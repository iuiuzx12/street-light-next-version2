"use client";
import { Button, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, User, Eye, EyeClosed } from "lucide-react";
import LangSwitcher from "@/app/components/lang-switcher";

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
          <div className="mb-4">
            <Input
              type="text"
              label={t(`username`)}
              placeholder={t(`username-placeholder`)}
              onChange={(e) => setUsername(e.target.value)}
              classNames={{
                input: ["placeholder:text-white/200"],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-gradient-to-tr from-blue-200 to-blue-100  shadow-lg -m-15",
                ],
              }}
              endContent={
                <User
                  className="text-2xl text-default-400 pointer-events-none"
                  width="25px"
                  height="25px"
                />
              }
            />
          </div>
          <div className="mb-6">
            <Input
              label={t(`password`)}
              placeholder={t(`password-placeholder`)}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <Eye
                      className="text-2xl text-default-400 pointer-events-none"
                      width="25px"
                      height="25px"
                    />
                  ) : (
                    <EyeClosed
                      className="text-2xl text-default-400 pointer-events-none"
                      width="25px"
                      height="25px"
                    />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                input: ["placeholder:text-white/200"],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-gradient-to-tr from-blue-200 to-blue-100  shadow-lg -m-15",
                ],
              }}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <Button
            className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg -m-15 items-center"
            size="md"
            type="submit"
            fullWidth={true}
            variant="shadow"
            isLoading={isLoading}
            onPress={handleLogin}
            endContent={<LogIn></LogIn>}
          >
            {isLoading ? t(`logging-in`) : t(`btn-login`)}
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
