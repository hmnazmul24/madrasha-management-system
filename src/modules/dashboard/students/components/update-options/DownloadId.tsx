"use client";

import { auth } from "@/modules/marketing/server/user.action";
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import { Fragment, ReactNode } from "react";
import { toast } from "sonner";
import { StudentIdType } from "../../types";

const DownloadId = ({
  children,
  studentIdInfo,
}: {
  children: ReactNode;
  studentIdInfo: StudentIdType;
}) => {
  const { data: authData } = useQuery({
    queryKey: ["auth_data"],
    queryFn: async () => await auth(),
  });

  const generateStudentIdPDF = async () => {
    if (!authData) {
      return toast.error("Missing dependencies");
    }
    const doc = new jsPDF();

    // Add border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 81.6, 49.98); // slightly inside the card edge

    // Title / Institution Name
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(authData.madrashaName, 43, 8, { align: "center" });

    // Divider line
    doc.setDrawColor(150);
    doc.line(2, 16, 83.6, 16);

    // Student Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    const data = [
      { label: "Name", value: studentIdInfo.name },
      { label: "Course", value: studentIdInfo.course },
      { label: "Session", value: studentIdInfo.session },
      { label: "ID", value: `${studentIdInfo.id.toString()}` },
    ];

    const startY = 20;
    data.forEach((item, index) => {
      doc.text(`${item.label}:`, 4, startY + index * 5);
      doc.text(item.value, 25, startY + index * 5);
    });

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(60, 45.5, 80, 45.5);
    // Add the student's image
    console.log("above");

    if (studentIdInfo.imageUrl) {
      console.log("inside");

      const profileImg = new Image();
      profileImg.src = studentIdInfo.imageUrl; // Cloudinary URL
      doc.addImage(profileImg, "JPEG", 63, 18, 18, 18); // Position & size of profile picture
    }

    doc.setFontSize(6);
    doc.text("Authorized Signature", 70, 48, { align: "center" });

    // Save the card
    doc.save("Student-ID-Card.pdf");
  };

  return (
    <Fragment>
      <li
        onClick={async () => await generateStudentIdPDF()}
        className="flex items-center justify-start gap-2 cursor-pointer"
      >
        {children}
      </li>
    </Fragment>
  );
};

export default DownloadId;
