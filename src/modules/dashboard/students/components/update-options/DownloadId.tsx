"use client";

import { Fragment, ReactNode } from "react";
import { StudentIdType } from "../../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IdCardDownloadWrapper from "./IDCardDownloadWrapper";

const DownloadId = ({
  children,
  studentIdInfo,
}: {
  children: ReactNode;
  studentIdInfo: StudentIdType;
}) => {
  return (
    <Fragment>
      <Dialog>
        <DialogTrigger className="flex items-center gap-2">
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <IdCardDownloadWrapper student={studentIdInfo} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default DownloadId;
