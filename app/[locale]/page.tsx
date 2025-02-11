import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("MapTotal");

  return (
    <div >
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
        
          <p>Home</p>
      </div>
    </div>
  );
}
