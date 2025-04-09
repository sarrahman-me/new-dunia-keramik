"use client";
import { IMenu } from "@/interface/menu";
import { isActivePage } from "@/utils/isActivePage";
import { usePathname, useRouter } from "next/navigation";
import { BiMath } from "react-icons/bi";
import { LuCircleUser } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";


const menu: IMenu[] = [
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard />,
    href: "/dashboard",
  },
  {
    title: "Kalkulator",
    icon: <BiMath />,
    href: "/dashboard/kalkulator",
  },
  {
    title: "Kelola Pengguna",
    icon: <HiOutlineUsers />,
    href: "/dashboard/pengguna",
  },
  {
    title: "Profil",
    icon: <LuCircleUser />,
    href: "/dashboard/profil",
  },

];


const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="bg-white grid grid-cols-4 p-1 rounded-sm shadow-lg select-none">
      {menu.map((item, i) => {
        const isActive = isActivePage(item.href, pathname);
        return (
          <div
            key={i}
            onClick={() => router.push(item.href)}
            className={`flex flex-col justify-center items-center p-1 rounded-sm ${isActive ? "border bg-amber-600 text-white" : "text-amber-600"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {
              //              <p
              //  className={`text-xs text-center ${isActive ? "text-white" : "text-secondary-medium/50"
              //    } inline`}
              //>
              //  {item.title}
              //</p>
            }
          </div>
        );
      })}
    </aside>
  );
};

export default BottomBar;
