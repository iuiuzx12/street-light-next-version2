import Image from "next/image";
import { useTranslations } from "next-intl";

export default function mapTotal() {
  const t = useTranslations("MapTotal");

  // Extract the navigation object keys from the translations
  //const navigationKeys = Object.keys(t.raw("navigation"));
  return (
    <div >
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
          <p>{t(`title`)}</p>
      </div>
    </div>
  );
}