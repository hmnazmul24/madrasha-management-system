"use client";

import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "newVersionAccepted4";
const LOCAL_STORAGE_KEY_PREVIOUS = "newVersionAccepte3";

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
    <div className="flex items-center justify-evenly p-4 gap-3 bg-gradient-to-r from-black via-gray-800 to-black">
      <div className="text-white text-xs md:text-base space-y-2">
        <p>
          {" "}
          আমরা আমাদের ওয়েবসাইটে সম্প্রতি কিছু গুরুত্বপূর্ণ আপডেট এনেছি। এখন
          আপনারা ইংরেজি এবং বাংলা ভাষার মধ্যে পরিবর্তন করতে পারবেন। যদিও এই
          মুহূর্তে কিছু সীমাবদ্ধতা রয়েছে, তবুও আমরা আপনাদের সুবিধার্থে এই নতুন
          ভাষা পরিবর্তন করার বোতামটি যুক্ত করেছি।
          <span className="text-green-500">
            place: navigation sidebar&apos;s bottom
          </span>
        </p>
        <p>
          এছাড়াও, &quot;শিক্ষার্থী যোগ করুন&quot; বিভাগে কিছু প্রয়োজনীয় কোর্স
          আপডেট করা হয়েছে। আপনাদের চাহিদা অনুযায়ী আরও উন্নত ফিচার যোগ করার
          জন্য আমরা নিয়মিত কাজ করে যাচ্ছি। খুব শীঘ্রই আপনারা এক্সেল শিটে ডেটা
          ডাউনলোড এবং বিস্তারিত পিডিএফ ফাইল উভয় ভাষাতেই ডাউনলোডের সুবিধা পাবেন।
        </p>
        <p>আপনাদের সহযোগিতা এবং ধৈর্য্যের জন্য ধন্যবাদ।</p>
      </div>
      <Badge onClick={handleAccept} className="cursor-pointer rounded-full">
        Accept
      </Badge>
    </div>
  );
};

export default NewVersionMessage;
