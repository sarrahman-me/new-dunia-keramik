import React from "react";
import { Metadata } from "next";
import Sidebar from "@/layouts/sidebar";
import BottomBar from "@/layouts/bottomBar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <main className="bg-white min-h-screen md:p-2 text-sm lg:text-base">
      {/* sidebar */}
      <div className="p-2 pt-5 lg:p-5 fixed overflow-y-auto h-screen left-0 bottom-0 md:w-14 lg:w-72 min-h-screen hidden md:block select-none">
        <Sidebar />
      </div>

      {/* main dashboard */}
      <main className="bg-amber-50/30 p-2 lg:p-5 md:rounded-sm md:border min-h-screen ml-0 md:ml-14 lg:ml-72">
        {children}

        {/* footer */}
        <footer className="flex justify-center items-center space-y-5 flex-col pb-10 p-2">
          <p className="text-xs text-gray-500/50 text-center">
            Dibuat dan Dikelola oleh{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/sarrahman-me"
              className="underline text-amber-600/80"
            >
              Sarrahman
            </a>
          </p>
        </footer>
      </main>

      {/* bottom menu (mobile) */}
      <div className="p-2 bg-amber-50/30 sticky w-full bottom-0 block md:hidden select-none">
        <BottomBar />
      </div>
    </main>
  );
}
