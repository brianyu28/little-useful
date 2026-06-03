import type { QRCodePayload } from "../types/QRCodePayload";
import { QRCodeType } from "../types/QRCodeType";

function escapeCalendarText(value: string) {
  return value
    .trim()
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function escapeWifiValue(value: string) {
  return value.replaceAll(/([\\;,":])/g, "\\$1");
}

function formatCalendarDateTime(value: string) {
  const formattedValue = value.replaceAll(/[-:]/g, "");
  return formattedValue.length === 13 ? `${formattedValue}00` : formattedValue;
}

export function createQRCodeString(payload: QRCodePayload) {
  switch (payload.type) {
    case QRCodeType.URL: {
      const trimmedUrl = payload.url.trim();
      if (!trimmedUrl) return "";

      if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl)) return trimmedUrl;
      return `https://${trimmedUrl}`;
    }

    case QRCodeType.TEXT:
      return payload.text.trim();

    case QRCodeType.WIFI: {
      const trimmedSsid = payload.ssid.trim();
      if (!trimmedSsid) return "";

      const normalizedEncryption =
        payload.encryption === "nopass" ? "nopass" : payload.encryption;
      const passwordPart =
        normalizedEncryption === "nopass"
          ? ""
          : `P:${escapeWifiValue(payload.password)};`;

      return `WIFI:T:${normalizedEncryption};S:${escapeWifiValue(trimmedSsid)};${passwordPart}H:${payload.isHidden ? "true" : "false"};;`;
    }

    case QRCodeType.EMAIL: {
      const trimmedEmail = payload.email.trim();
      if (!trimmedEmail) return "";

      const params: string[] = [];
      if (payload.subject.trim()) {
        params.push(`subject=${encodeURIComponent(payload.subject.trim())}`);
      }
      if (payload.body.trim()) {
        params.push(`body=${encodeURIComponent(payload.body.trim())}`);
      }

      const query = params.join("&");
      return `mailto:${trimmedEmail}${query ? `?${query}` : ""}`;
    }

    case QRCodeType.PHONE: {
      const trimmedPhone = payload.phone.trim();
      return trimmedPhone ? `tel:${trimmedPhone}` : "";
    }

    case QRCodeType.SMS: {
      const trimmedPhone = payload.phone.trim();
      if (!trimmedPhone) return "";

      const trimmedMessage = payload.message.trim();
      return `sms:${trimmedPhone}${trimmedMessage ? `?body=${encodeURIComponent(trimmedMessage)}` : ""}`;
    }

    case QRCodeType.CALENDAR: {
      if (!payload.title.trim() || !payload.start || !payload.end) return "";

      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Little Useful//QR Code//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `SUMMARY:${escapeCalendarText(payload.title)}`,
        `DTSTART:${formatCalendarDateTime(payload.start)}`,
        `DTEND:${formatCalendarDateTime(payload.end)}`,
      ];

      if (payload.location.trim()) {
        lines.push(`LOCATION:${escapeCalendarText(payload.location)}`);
      }
      if (payload.description.trim()) {
        lines.push(`DESCRIPTION:${escapeCalendarText(payload.description)}`);
      }

      lines.push("END:VEVENT", "END:VCALENDAR");
      return lines.join("\r\n");
    }
  }
}
