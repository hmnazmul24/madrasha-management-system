"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { ChildrenProps } from "@/data/types";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/modules/marketing/hooks/use-user";
import { userLogout } from "@/modules/marketing/server/user.action";
import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "./AppSideBar";
import NewVersionMessage from "./NewVersionMessage";

const DashboardLayout = ({ children }: ChildrenProps) => {
  const { data: auth } = useUserAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-star-moon z-20 ">
        <NewVersionMessage />
        {/* <UnderDevelopmentMessage /> */}
        <div
          className={cn(
            "flex w-full z-10 items-center justify-between gap-4 px-1   bg-stone-900/50 py-3 "
          )}
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="md:text-xl text-sm text-emerald-500 font-bold ">
              {auth && auth.madrashaName}
            </h1>
          </div>
          {auth &&
            (auth.role === "ADMIN" ? (
              <Link href={"/admin/madrasha/all"}>
                <Button
                  variant={"secondary"}
                  className="hover:text-red-400 cursor-pointer"
                >
                  Admin Panel <ChevronRight />
                </Button>
              </Link>
            ) : (
              <Button
                variant={"ghost"}
                onClick={async () => await userLogout()}
                className="hover:text-red-400 cursor-pointer"
              >
                logout <LogOut />
              </Button>
            ))}
        </div>
        <div className="w-full p-3  min-h-dvh text-black">
          <Suspense fallback={<p>loading...</p>}>{children}</Suspense>
          <Toaster />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
