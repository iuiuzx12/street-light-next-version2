import { useTranslations } from "next-intl";

export default function dashboardPeriod() {
  const t = useTranslations("ControlIndividual");

  return (
    <div >
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
          <p>{t(`title`)}</p>
      </div>
    </div>
  );
}