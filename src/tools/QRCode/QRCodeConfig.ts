import { QrCode } from "lucide-react";
import { defineTool } from "../../utils/defineTool";

export const QRCodeConfig = defineTool({
  title: "QR Code",
  description: "Generate QR codes for URLs, Wi-Fi, events, and more",
  icon: QrCode,
  keywords: ["barcode", "url qr", "wifi qr", "calendar qr", "link"],
  path: "/qr",
});
