"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React, { Suspense } from "react";
import { AppSidebar } from "./AppSideBar";
import { Toaster } from "sonner";
import { ChildrenProps } from "@/data/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { userLogout } from "@/modules/marketing/server/user.action";
import { useUserAuth } from "@/modules/marketing/hooks/use-user";
import Link from "next/link";
import { UnderDevelopmentMessage } from "./UnderDevelopmentMessage";

const DashboardLayout = ({ children }: ChildrenProps) => {
  const { data: auth } = useUserAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-star-moon z-20 ">
        {/* <NewVersionMessage /> */}
        <UnderDevelopmentMessage />
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
