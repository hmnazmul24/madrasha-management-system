"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import logo from "../../../public/earn-way.png";
import Login from "./Login";
import { useUserAuth } from "./hooks/use-user";

const MarketingPage = () => {
  const { data: auth, isPending } = useUserAuth();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    closeRef.current?.click();
  };
  return (
    <div className="flex items-center flex-col gap-2 justify-center h-dvh w-full relative">
      <Image
        src={"/mosque.webp"}
        height={1000}
        width={1000}
        alt="mosque-image"
        className="absolute top-0 left-0 h-full object-cover w-full"
      />
      <div className=" absolute top-0 left-0 h-full w-full"></div>
      <motion.div
        transition={{ duration: 2 }}
        initial={{
          opacity: 1,
          backgroundColor: "black",
        }}
        whileInView={{
          opacity: 0.85,
          backgroundColor: "black",
        }}
        className="bg-black/85 absolute top-0 left-0 h-full w-full"
      ></motion.div>
      {/* mainelement */}
      <motion.div
        transition={{ duration: 2 }}
        initial={{
          opacity: 0,
          translateY: 30,
        }}
        whileInView={{
          opacity: 1,
          translateY: 0,
        }}
        className="flex items-center justify-center flex-col gap-3 z-30 p-4"
      >
        <h2 className="text-lg md:text-4xl font-bold mb-4 text-black dark:text-emerald-500 max-w-4xl">
          Madrasha Management System
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-center text-xs  md:text-base max-w-sm">
          A comprehensive student management system specially for madrasha
          students in Bangladesh
        </p>
        <span className="text-blue-500">Powered By</span>
        <div className="flex items-center justify-center flex-col gap-2">
          <Image height={90} width={90} src={logo} alt="logo" />
          <p className="text-sm md:text-base text-center text-amber-500">
            The Earn way academy
          </p>
        </div>
        {!isPending && auth && auth.authenticated ? (
          <Link
            href={
              auth.role === "MADRASHA"
                ? "/dashboard/overview"
                : "/admin/madrasha/all"
            }
          >
            {" "}
            <Button className="mt-2 cursor-pointer">Dashboard</Button>
          </Link>
        ) : (
          <Dialog>
            <Button variant={"outline"} className="mt-2 cursor-pointer" asChild>
              <DialogTrigger>Login</DialogTrigger>
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <Login close={closeModal} />
              </DialogHeader>
            </DialogContent>
            <DialogClose ref={closeRef} />
          </Dialog>
        )}
      </motion.div>
      {/* mainelement */}
    </div>
  );
};

export default MarketingPage;
