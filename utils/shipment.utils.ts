import { Shipment } from "@/services/shipment.queries";
import moment from "moment";
import ExcelJS from "exceljs";
import { nanoid } from "nanoid";
import * as XLSX from "xlsx";

export const handleExportProduct = async (
  shipmentData: Shipment[],
): Promise<void> => {
  try {
    if (shipmentData && Array.isArray(shipmentData)) {
      const dataToExport = shipmentData.map((shipment) => ({
        Status: shipment.status ?? "-",
        Carrier: shipment.carrier ?? "-",
        Reference: shipment.referenceNo ?? "-",
        Booking: shipment.mblNo ?? "-",
        Container: shipment.containers
          ?.map((container) => container.containerNumber)
          .join(" , "),
        "Container Count": shipment.containers?.length ?? 0,
        "Port Of Loading": shipment.pol?.location?.name ?? "-",
        "Date Of Loading":
          moment(shipment.pol?.date).format("DD/MM/YYYY") ?? "-",
        "Port Of Discharge": shipment.pod?.location?.name ?? "-",
        "Date Of Discharge":
          (moment(shipment.pod?.date).format("DD/MM/YYYY") ||
            moment(shipment.pod?.predictive_eta).format("DD/MM/YYYY")) ??
          "-",
        Tags: !!shipment.tags?.length ? shipment.tags.join(" , ") : "-",
        "Created At":
          moment(shipment.createdAt).format("DD/MM/YYYY HH:mm:SS") ?? "-",
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Make the header row bold
      const headerStyle = { font: { bold: true } };
      const columnNames = Object.keys(dataToExport[0]);
      const headerRange = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: 0, c: columnNames.length - 1 },
      });
      worksheet["!cols"] = columnNames.map(() => ({ wch: 15 })); // Set column width

      columnNames.forEach((col, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        worksheet[cellAddress].s = headerStyle;
      });

      XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

      XLSX.writeFile(
        workbook,
        `${moment().format("YYYYMMDD") + nanoid()}_shipment.xlsx`,
      );
    } else {
      console.error("#==================Export Error");
    }
  } catch (error) {
    console.error("#==================Export Error", (error as Error).message);
  }
};

export const shortenContainerSizeType = (sizeType: string): string => {
  const parts = sizeType.split(' ');
  if (parts.length < 2) return sizeType;

  const number = parts[0];
  const initials = parts.slice(1).map(word => word[0].toUpperCase()).join('');

  return `${number} ${initials}`;
};
