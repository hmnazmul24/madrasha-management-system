"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const RedirectBox = () => {
  const data = useSearchParams();

  return data.get("name") ? (
    <div className="fixed z-50 p-2 text-sm top-0 left-0 w-full bg-black border-b border-b-white/50 text-white ">
      <h3 className="text-blue-500">Our new version is alive 🐤</h3>
      <h1 className=" text-emerald-400 text-base  mb-2">
        Welcome Back <span className="font-bold ">#{data.get("name")}</span> ,
        enter your new credentials to login.
      </h1>

      <h2>#username : {data.get("username")}</h2>
      <h2>#password : {data.get("password")}</h2>
    </div>
  ) : null;
};

export default RedirectBox;
