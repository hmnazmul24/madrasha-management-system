"use client";

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "newVersionAccepted";

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
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="flex h-12 items-center justify-evenly p-4 gap-3 bg-blue-800">
      <div className="text-white text-xs md:text-base">
        Info: Application has just Updated 🚀 and statistic and overview
        updation is in process..
      </div>
      <Badge onClick={handleAccept} className="cursor-pointer rounded-full">
        Accept
      </Badge>
    </div>
  );
};

export default NewVersionMessage;
