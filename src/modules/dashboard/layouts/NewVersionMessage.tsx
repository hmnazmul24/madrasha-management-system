"use client";

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "newVersionAccepted6";
const LOCAL_STORAGE_KEY_PREVIOUS = "newVersionAccepte5";

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
    <div className="flex items-center justify-evenly p-4 gap-3 bg-gradient-to-r from-red-900 via-purple-800 to-green-900">
      <div className="text-white text-xs md:text-base space-y-2">
        <h1 className="mb-2 text-xl font-semibold text-white">
          Just Updated 🚀
        </h1>
        <p className="text-white">
          {`Experience enhanced : now you can change your password by going through settings/preferrence and may get slightly detail financial status info pdf`}
        </p>
      </div>
      <Badge onClick={handleAccept} className="cursor-pointer rounded-full">
        Accept
      </Badge>
    </div>
  );
};

export default NewVersionMessage;
