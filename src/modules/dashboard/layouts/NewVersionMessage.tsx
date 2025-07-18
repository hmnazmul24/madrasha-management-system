"use client";

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "newVersionAccepted5";
const LOCAL_STORAGE_KEY_PREVIOUS = "newVersionAccepte4";

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
    <div className="flex items-center justify-evenly p-4 gap-3 bg-gradient-to-r from-stone-900 via-gray-800 to-black">
      <div className="text-white text-xs md:text-base space-y-2">
        <h1 className="mb-2 text-xl font-semibold text-blue-500">
          Just Updated 🚀
        </h1>
        <p className="text-green-600">
          {`Experience enhanced : 1.student filterings (gender filter, and
          others), 2.teacher salary record (added year and month), 3.teacher salary now included in spending chart 4. further development will be avilable soon, InshaAllah`}
        </p>
      </div>
      <Badge onClick={handleAccept} className="cursor-pointer rounded-full">
        Accept
      </Badge>
    </div>
  );
};

export default NewVersionMessage;
