import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React, { Fragment, ReactNode } from "react";

type NewAddedTagProps = {
  children: ReactNode;
  className?: string;
};

// 🎯 The last date the "new" tag should be visible
const NEW_TAG_END_DATE = new Date("2025-07-25T23:59:59");

export default function NewAddedTag({ children, className }: NewAddedTagProps) {
  const now = new Date();

  const showNewTag = now <= NEW_TAG_END_DATE;

  return (
    <Fragment>
      {showNewTag && (
        <div className="size-0 bg-transparent overflow-visible relative">
          <Badge
            className={cn(
              "absolute -top-7 -right-10 bg-gradient-to-r from-red-500 p-0 px-2 to-blue-500 text-white",
              className
            )}
          >
            new
          </Badge>
          {children}
        </div>
      )}
    </Fragment>
  );
}
