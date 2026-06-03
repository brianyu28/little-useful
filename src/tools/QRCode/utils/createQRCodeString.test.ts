import { describe, expect, it } from "vitest";
import { QRCodeType } from "../types/QRCodeType";
import { createQRCodeString } from "./createQRCodeString";

describe("createQRCodeString", () => {
  it("normalizes URLs without a scheme", () => {
    expect(
      createQRCodeString({ type: QRCodeType.URL, url: "example.com" }),
    ).toBe("https://example.com");
  });

  it("escapes Wi-Fi credentials", () => {
    expect(
      createQRCodeString({
        type: QRCodeType.WIFI,
        encryption: "WPA",
        isHidden: false,
        password: "pass;word",
        ssid: "Cafe:Main",
      }),
    ).toBe("WIFI:T:WPA;S:Cafe\\:Main;P:pass\\;word;H:false;;");
  });

  it("percent-encodes email bodies without plus signs", () => {
    expect(
      createQRCodeString({
        type: QRCodeType.EMAIL,
        body: "Hello there",
        email: "hello@example.com",
        subject: "Quick note",
      }),
    ).toBe("mailto:hello@example.com?subject=Quick%20note&body=Hello%20there");
  });

  it("formats calendar events", () => {
    expect(
      createQRCodeString({
        type: QRCodeType.CALENDAR,
        description: "",
        end: "2026-06-03T10:30",
        location: "Room 1",
        start: "2026-06-03T09:00",
        title: "Planning",
      }),
    ).toBe(
      [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Little Useful//QR Code//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "SUMMARY:Planning",
        "DTSTART:20260603T090000",
        "DTEND:20260603T103000",
        "LOCATION:Room 1",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n"),
    );
  });
});
