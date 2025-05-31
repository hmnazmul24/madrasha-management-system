"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Network, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import adminUserImg from "../../../../public/admin-user.jpg";

const sidebarOptions = [
  {
    section: "Institutions",
    options: [
      // {
      //   name: "Statistics & Overviews",
      //   url: "/admin/madrasha/overview",
      //   icon: LayoutDashboard,
      // },
      {
        name: "All Madrasha",
        url: "/admin/madrasha/all",
        icon: Network,
      },
      {
        name: "Create New",
        url: "/admin/madrasha/create",
        icon: PencilLine,
      },
    ],
  },
];
export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className="z-50">
      <SidebarContent className="bg-zinc-900 ">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mt-1 font-black text-blue-500">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-3 ">
              {sidebarOptions.map((item) => (
                <div key={item.section}>
                  <h1 className="mb-1 border-b pb-1">{item.section}</h1>
                  <div className="mb-4">
                    {item.options.map((info) => (
                      <Link key={info.url} href={info.url}>
                        <div
                          className={cn(
                            "flex items-center py-2 transition-all hover:text-blue-500 text-gray-400 gap-2",
                            pathname.split("?")[0] === info.url &&
                              "bg-zinc-800 rounded-md pl-2"
                          )}
                        >
                          <info.icon className="size-4" />
                          <span>{info.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-5">
                <div className="size-8 overflow-hidden bg-white rounded-full">
                  <Image
                    src={adminUserImg}
                    height={30}
                    width={30}
                    alt="profile"
                    className="w-full translate-y-1 bg-white"
                  />
                </div>
                <div className="">
                  <h1 className="text-xs font-bold">Admin</h1>
                  <h3 className="text-xs text-slate-400">
                    Chief Executive Officer
                  </h3>
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
