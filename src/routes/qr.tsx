import { createFileRoute } from "@tanstack/react-router";
import QRCode from "../tools/QRCode/QRCode";
import { QRCodeConfig } from "../tools/QRCode/QRCodeConfig";
import { createPageHead } from "../utils/createPageHead";

export const Route = createFileRoute("/qr")({
  component: QRCode,
  head: () => createPageHead(QRCodeConfig.title),
});
