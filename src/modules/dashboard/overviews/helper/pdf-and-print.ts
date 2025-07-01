import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { gotDataType } from "../types";

export async function generateSummaryPDF(
  data: gotDataType,
  timeRange: "7d" | "30d" | "90d",
  type: "print" | "download"
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = height - 60;

  const drawText = (
    text: string,
    size = 14,

    bold = false,
    indent = 0,
    spacing = 24
  ) => {
    page.drawText(text, {
      x: 50 + indent,
      y,
      size,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= spacing;

    if (bold) {
    }
  };

  // === Calculate reference date range ===
  const today = new Date();
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - days);

  const isWithinRange = (date: Date) => {
    const d = new Date(date);
    return d >= fromDate && d <= today;
  };

  // === Filtered data ===
  const donationData = data.earnings.donationData.filter((item) =>
    isWithinRange(item.date)
  );
  const admissionData = data.earnings.admissionData.filter((item) =>
    isWithinRange(item.date)
  );
  const studentFeeData = data.earnings.studentFeeData.filter((item) =>
    isWithinRange(item.date)
  );
  const spendingData = data.spending.allSpendings.filter((item) =>
    isWithinRange(item.date)
  );

  // === Calculate Totals ===
  const totalDonation = donationData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const totalAdmission = admissionData.reduce(
    (sum, item) => sum + (item.admissionTimePaid || 0),
    0
  );
  const totalStudentFees = studentFeeData.reduce(
    (sum, item) => sum + item.mealFees + item.educationFees,
    0
  );
  const totalSpending = spendingData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalEarnings = totalDonation + totalAdmission + totalStudentFees;

  // === Draw PDF Content ===
  drawText(
    ` ${timeRange.toUpperCase()} Financial Summary Report`,
    18,
    true,
    0,
    36
  );
  drawText(`Total Earnings: ${totalEarnings.toLocaleString()} taka`, 14);
  drawText(
    `- From Donations: ${totalDonation.toLocaleString()} taka`,
    12,
    false,
    20
  );
  drawText(
    `- From Admissions: ${totalAdmission.toLocaleString()} taka`,
    12,
    false,
    20
  );
  drawText(
    `- From Student Fees: ${totalStudentFees.toLocaleString()} taka`,
    12,
    false,
    20
  );

  y -= 10;
  drawText(`Total Spendings: ${totalSpending.toLocaleString()} taka`, 14);

  const pdfBytes = await pdfDoc.save();

  if (type === "download") {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "financial-summary.pdf");
  } else {
    const blobUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
    const win = window.open(blobUrl);
    if (win) win.print();
    else window.location.href = blobUrl; // fallback
  }
}
