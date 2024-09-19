import Image from "next/image";
import { useTranslations } from "next-intl";
import dynamic from 'next/dynamic'

import  StaticMapComponent from  '@/app/components/map'


export default function mapTotal(props: any) {
  const t = useTranslations("MapTotal");

  // Extract the navigation object keys from the translations
  //const navigationKeys = Object.keys(t.raw("navigation"));
  const { position, zoom } = props
  return (
    <div >
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
          <p>{t(`title`)}</p>
          <div className="relative w-full h-[700px]"> {/* ตรวจสอบขนาดที่นี่ */}
          {/* </div><div className="relative w-full h-[500px]"> ตรวจสอบขนาดที่นี่ */}
          <StaticMapComponent />
        </div>
          
          
      </div>
      
    </div>
  );
}