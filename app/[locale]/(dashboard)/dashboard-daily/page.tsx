// import Image from "next/image";
// import { useTranslations } from "next-intl";

// export default function dashboardPeriod() {
//   const t = useTranslations("DashboardDaily");

//   // Extract the navigation object keys from the translations
//   //const navigationKeys = Object.keys(t.raw("navigation"));
//   return (
//     <div >
//       <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-5">
//           <p>{t(`title`)}</p>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import { useTranslations } from "next-intl";

// const fetchData = async () => {
//   try {
//     const res = await fetch('/en/api/data');
//     const newData = await res.json();
//     //setData(newData);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// fetchData();

export default function dashboardPeriod() {
  const t = useTranslations("DashboardDaily");

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

