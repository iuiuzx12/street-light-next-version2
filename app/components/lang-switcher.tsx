import React, { useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import gbFlag from "/public/icon/flag/united-kingdom.svg";
import thFlag from "/public/icon/flag/thailand.svg";

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string;
    code: string;
    flag: StaticImageData;
  }

  const router = useRouter();
  const pathname = usePathname();
  const flag_btn = pathname.slice(1, 3) === "th" ? thFlag : gbFlag;
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const options: Option[] = [
    { country: "", code: "en", flag: gbFlag },
    { country: "", code: "th", flag: thFlag },
  ];

  const setOption = (option: Option) => {
    setIsOptionsExpanded(false);
    router.push(`/${option.code}/${pathname.slice(3)}`);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative text-lg w-30">
        <button
          className="justify-between  w-full border border-blue-200 text-white bg-blue-400
          hover:bg-blue-300 focus:ring-2 focus:outline-none
          focus:bg-blue-200 font-medium rounded-lg text-sm px-1 py-0 text-center flex items-center
          dark:bg-blue-400 dark:hover:bg-blue-200 dark:focus:ring-blue-300"
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => setIsOptionsExpanded(false)}
        >
          <Image
            src={flag_btn}
            alt="flag_btn"
            width={30}
            height={30}
          />
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-4 w-4 transform transition-transform duration-200 ease-in-out ${isOptionsExpanded ? "rotate-180" : "rotate-0"
              }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          className={`transition-transform duration-500 ease-custom ${!isOptionsExpanded
            ? "-translate-y-1/2 scale-y-0 opacity-0"
            : "translate-y-0 scale-y-100 opacity-100"
            }`}
        >
          <ul className="absolute left-0 right-0 mb-4 bg-blue-300 divide-y rounded-lg shadow-lg overflow-hidden">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-3 py-2 transition-colors duration-300 hover:bg-blue-200 flex items-center cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setOption(option);
                }}
                onClick={() => setIsOptionsExpanded(false)}
              >
                <Image
                  src={option.flag}
                  width="30"
                  height="30"
                  priority={true}
                  alt="logo"
                />
                &nbsp;&nbsp;{option.country}
                {pathname === `/${option.code}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LangSwitcher;