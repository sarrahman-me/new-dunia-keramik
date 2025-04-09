"use client";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { BiMath } from "react-icons/bi";
import { isActivePage } from "@/utils/isActivePage";
import { usePathname, useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import { Confirm } from "notiflix";
import { IMenu } from "@/interface/menu";
import { BsBoxSeam } from "react-icons/bs";


const dashboard_menu_dekstop: IMenu[] = [
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard />,
    href: "/dashboard",
  },
  {
    title: "Barang",
    icon: <BsBoxSeam />,
    href: "/dashboard/products",
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
];


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    Confirm.show(
      'Konfirmasi',
      'Ingin keluar dari aplikasi ?',
      'Keluar',
      'Tidak',
      async () => {
        try {
          const res = await fetch("/api/logout", {
            method: "POST",
          });

          if (res.ok) {
            router.push("/login");
          }
        } catch (error) {
          console.error("Logout gagal:", error);
        }
      },
      () => { },
      { okButtonBackground: "red", titleColor: "red" },
    );
  };


  return (
    <aside className="space-y-10 select-none">
      {/* logo */}
      <span className="flex items-center justify-center space-x-2 text-lg md:text-xl text-amber-600">
        <p className="hidden lg:inline font-semibold">Kerajaan Keramik</p>
      </span>

      {/* navigation */}
      <div className="space-y-3">
        {dashboard_menu_dekstop.map((item, i) => {
          const isActive = isActivePage(item.href, pathname);
          return (
            <div
              key={i}
              onClick={() => router.push(item.href)}
              className={`flex items-center space-x-3 p-2 rounded-sm text-secondary-medium cursor-pointer select-none ${isActive
                ? "bg-amber-600 text-white font-medium shadow-sm"
                : "hover:bg-amber-50"
                }`}
            >
              <span
                className={`text-lg ${isActive ? "text-white" : "text-amber-600"
                  }`}
              >
                {item.icon}
              </span>
              <p className="lg:block hidden">{item.title}</p>
            </div>
          );
        })}
        <div
          onClick={handleLogout}
          className={`flex items-center space-x-3 p-2 rounded-sm text-secondary-medium cursor-pointer select-none hover:bg-red-50`}
        >
          <span
            className={`text-lg text-red-600`}
          >
            <CiLogout />
          </span>
          <p className="lg:block hidden">Keluar</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
