"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

import { StudentIdType } from "../../types";
import { StudentIdCardPDF } from "./StudentIdCardPDF";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function IdCardDownloadWrapper({
  student,
}: {
  student: StudentIdType;
}) {
  return (
    <div className="p-8">
      <PDFDownloadLink
        document={<StudentIdCardPDF {...student} />}
        fileName="student-id-card.pdf"
      >
        {({ loading }) =>
          loading ? (
            <Button disabled variant={"ghost"}>
              Preparing...
            </Button>
          ) : (
            <div className="flex items-center flex-col gap-3">
              <h1>{student.name}</h1>
              <Button className="cursor-pointer" variant={"signature"}>
                Download <Download />
              </Button>
            </div>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}
