"use client";

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "newVersionAccepted2";
const LOCAL_STORAGE_KEY_PREVIOUS = "newVersionAccepted";

const NewVersionMessage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREVIOUS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="flex h-12 items-center justify-evenly p-4 gap-3 bg-gradient-to-r from-blue-700 via-lime-800 to-purple-700">
      <div className="text-white text-xs md:text-base">
        Info: Application has just Updated 🚀 Now you can download monthly
        status as well as print them. Further development is in progress...
      </div>
      <Badge onClick={handleAccept} className="cursor-pointer rounded-full">
        Accept
      </Badge>
    </div>
  );
};

export default NewVersionMessage;
