import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { gotDataType } from "../types";
import { SpendingFieldsEnum } from "../../spendings/types/type";

// Utility to format date
const formatDate = (date: Date) => new Date(date).toISOString().split("T")[0];

export async function generateSummaryPDF(
  data: gotDataType,
  timeRange: "7d" | "30d" | "90d",
  type: "print" | "download"
) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 60;

  const drawText = (text: string, size = 12, indent = 0, spacing = 20) => {
    if (y < 80) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = newPage.getSize().height - 60;
      page = newPage;
    }

    page.drawText(text, {
      x: 50 + indent,
      y,
      size,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= spacing;
  };

  // === Filter Data Based on Range ===
  const today = new Date();
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - days);

  const isWithinRange = (date: Date) => {
    const d = new Date(date);
    return d >= fromDate && d <= today;
  };

  const dayMap = new Map<
    string,
    {
      earnings: {
        from: "donations" | "addmissions" | "studentFees";
        amount: number;
      }[];
      spendings: {
        field: SpendingFieldsEnum;
        amount: number;
      }[];
    }
  >();

  const addEarning = (
    date: Date,
    amount: number,
    from: "donations" | "addmissions" | "studentFees"
  ) => {
    const d = formatDate(date);
    if (!dayMap.has(d)) {
      dayMap.set(d, { earnings: [{ amount, from }], spendings: [] });
    } else {
      const entry = dayMap.get(d)!;
      const existing = entry.earnings.find((e) => e.from === from);
      if (existing) {
        existing.amount += amount;
      } else {
        entry.earnings.push({ amount, from });
      }
    }
  };

  const addSpending = (
    date: Date,
    amount: number,
    field: SpendingFieldsEnum
  ) => {
    const d = formatDate(date);
    if (!dayMap.has(d)) dayMap.set(d, { earnings: [], spendings: [] });
    dayMap.get(d)!.spendings.push({ amount, field });
  };

  // Group all entries
  data.earnings.donationData
    .filter((d) => isWithinRange(d.date))
    .forEach((d) => d.amount && addEarning(d.date, d.amount, "donations"));

  data.earnings.admissionData
    .filter((d) => isWithinRange(d.date))
    .forEach(
      (d) =>
        d.admissionTimePaid &&
        addEarning(d.date, d.admissionTimePaid, "addmissions")
    );

  data.earnings.studentFeeData
    .filter((d) => isWithinRange(d.date))
    .forEach((d) =>
      addEarning(d.date, d.educationFees + d.mealFees, "studentFees")
    );

  data.spending.allSpendings
    .filter((d) => isWithinRange(d.date))
    .forEach((d) => addSpending(d.date, d.amount, d.field));

  // Sort dates ascending
  const sortedDates = [...dayMap.keys()].sort();

  // === Start Writing to PDF ===
  drawText(`${timeRange.toUpperCase()} Financial Summary Report`, 16, 0, 28);

  for (const date of sortedDates) {
    const entry = dayMap.get(date)!;
    drawText(` Date: ${date}`, 14, 0, 22);

    if (entry.earnings.length > 0) {
      drawText(`Earnings:`, 12, 10);
      let totalEarning = 0;
      for (const earn of entry.earnings) {
        drawText(
          `- ${earn.from}: ${earn.amount.toLocaleString()} taka`,
          11,
          20
        );
        totalEarning += earn.amount;
      }
      drawText(`Total Earnings: ${totalEarning.toLocaleString()} taka`, 11, 20);
    } else {
      drawText(`Earnings: None`, 12, 10);
    }

    if (entry.spendings.length > 0) {
      drawText(`Spendings:`, 12, 10, 16);
      let totalSpending = 0;
      for (const spend of entry.spendings) {
        drawText(
          `- ${spend.field}: ${spend.amount.toLocaleString()} taka`,
          11,
          20
        );
        totalSpending += spend.amount;
      }
      drawText(
        `Total Spendings: ${totalSpending.toLocaleString()} taka`,
        11,
        20
      );
    } else {
      drawText(`Spendings: None`, 12, 10);
    }

    y -= 8;
  }

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
    else window.location.href = blobUrl;
  }
}
