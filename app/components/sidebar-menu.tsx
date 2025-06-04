import { SideNavItem } from "../model/side-nav-Item";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardBody } from "@heroui/react";

export default function MenuItem({ item }: { item: SideNavItem }) {
  const pathname = usePathname();
  const locale = pathname.slice(0, 3);
  //item.path = locale + item.path;
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  const t = useTranslations("Sidebar");
  return (
    <Card className="m-0">
      <CardBody>
        {item.submenu ? (
          <>
            <button
              onClick={toggleSubMenu}
              className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
                pathname.includes(item.path!) ? "bg-zinc-100" : ""
              }`}
            >
              <div className="flex flex-row space-x-4 items-center">
                <Image
                  src={item.icon!}
                  width={0}
                  height={0}
                  className="w-6 h-auto"
                  alt={item.title!}
                />
                <span className="font-semibold text-xl  flex">
                  {t(item.title)}
                </span>
              </div>

              <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
                <Icon icon="lucide:chevron-down" width="24" height="24" />
              </div>
            </button>

            {subMenuOpen && (
              <div className="my-4 ml-5 flex flex-col space-y-4">
                {item.subMenuItems?.map((subItem, idx) => {
                  //subItem.path = locale + subItem.path
                  //subItem.path = locale + subItem.path
                  return subItem.status == true ? (
                    <Link
                      key={idx}
                      href={locale + subItem.path}
                      className={`flex space-x-2 ${
                        locale + subItem.path === pathname ? "font-bold" : ""
                      }`}
                    >
                      <Image
                        src={subItem.icon!}
                        width={0}
                        height={0}
                        className="w-5 h-auto"
                        alt={subItem.title!}
                      />
                      <span> </span>
                      <p>{t(subItem.title)}</p>
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.path!}
            className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
              item.path === locale + pathname ? "bg-zinc-100" : ""
            }`}
          >
            <Image
              src={item.icon!}
              width={0}
              height={0}
              className="w-6 h-auto"
              alt={item.title!}
            />
            <span className="font-semibold text-xl flex">{t(item.title)}</span>
          </Link>
        )}
      </CardBody>
    </Card>
  );
}
