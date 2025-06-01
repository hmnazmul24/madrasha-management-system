"use client";

import React from "react";
import { StudentIdType } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/modules/marketing/server/user.action";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

const IdDesignComp = ({ stydentIdInfo }: { stydentIdInfo: StudentIdType }) => {
  const { data } = useQuery({
    queryKey: ["auth-info"],
    queryFn: async () => await auth(),
  });

  const downloadPDF = async () => {
    const cardHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Noto Sans Bengali', Arial, sans-serif;
              background: #fff;
              margin: 0;
              padding: 0;
            }
            .card {
              width: 340px;
              height: 200px;
              border: 1px solid #000;
              padding: 10px;
              font-size: 12px;
              background: #fff;
              color: #000;
            }
            .title {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 4px;
            }
            .divider {
              border-bottom: 1px solid #000;
              margin: 6px 0;
            }
            .info {
              display: flex;
              justify-content: space-between;
            }
            .left {
              flex: 1;
            }
            .image {
              width: 80px;
              height: 80px;
              border: 1px solid #000;
              object-fit: cover;
            }
            .signature {
              text-align: right;
              margin-top: 30px;
            }
            .line {
              width: 100px;
              height: 1px;
              background-color: #000;
              margin-bottom: 4px;
              margin-left: auto;
            }
            .sign-text {
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="card" id="id-card">
            <div class="title">${data?.madrashaName}</div>
            <div class="divider"></div>
            <div class="info">
              <div class="left">
                <div><strong>Name:</strong> ${stydentIdInfo.name}</div>
                <div><strong>Course:</strong> ${stydentIdInfo.course}</div>
                <div><strong>Session:</strong> ${stydentIdInfo.session}</div>
                <div><strong>ID:</strong> ${stydentIdInfo.id}</div>
              </div>
              ${
                stydentIdInfo.imageUrl
                  ? `<img class="image" src="${stydentIdInfo.imageUrl}" crossorigin="anonymous" />`
                  : ""
              }
            </div>
            <div class="signature">
              <div class="line"></div>
              <div class="sign-text">Authorized Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "Print", "width=400,height=600");
    if (!win) return alert("Popup blocked. Please allow popups.");

    win.document.open();
    win.document.writeln(cardHtml);
    win.document.close();

    win.onload = async () => {
      const card = win.document.getElementById("id-card");
      if (!card) return;

      const canvas = await html2canvas(card, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("student-id-card.pdf");
      win.close();
    };
  };

  if (!data) return null;

  return (
    <div className="flex items-center justify-center py-10">
      <Button onClick={downloadPDF} variant={"signature"} className="py-6">
        Download ID Card PDF
      </Button>
    </div>
  );
};

export default IdDesignComp;
