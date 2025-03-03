"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const ServerErrorNotification = () => {
  
  const router = useRouter();
  const t = useTranslations("Error");  
  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-red-600 to-red-300">
      <div className="bg-gradient-to-tr from-red-400 to-red-200 p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <AiOutlineExclamationCircle
          className="mx-auto text-red-600"
          size={40}
        />
        <h4 className="mt-4 text-xl text-red-600 font-semibold">
          {t(`error-api`)}
        </h4>
        <p className="mt-2 text-gray-600">
          {t(`error-api-description`)}
        </p>
        <Button
          className="mt-6 px-4 py-2 bg-gradient-to-tr from-red-600 to-red-200 text-white rounded-full hover:bg-red-700 focus:outline-none"
          onPress={handleRetry}
        >
          {t(`btn-error-api-retry`)}
        </Button>
      </div>
    </div>
  );
};

export default ServerErrorNotification;
