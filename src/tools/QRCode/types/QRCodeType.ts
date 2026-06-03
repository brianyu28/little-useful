export const QRCodeType = {
  URL: "url",
  TEXT: "text",
  WIFI: "wifi",
  EMAIL: "email",
  PHONE: "phone",
  SMS: "sms",
  CALENDAR: "calendar",
} as const;

export type QRCodeType = (typeof QRCodeType)[keyof typeof QRCodeType];
