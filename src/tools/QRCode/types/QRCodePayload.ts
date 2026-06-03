import type { QRCodeType } from "./QRCodeType";

export type QRCodePayload =
  | {
      readonly type: typeof QRCodeType.URL;
      readonly url: string;
    }
  | {
      readonly type: typeof QRCodeType.TEXT;
      readonly text: string;
    }
  | {
      readonly type: typeof QRCodeType.WIFI;
      readonly encryption: string;
      readonly isHidden: boolean;
      readonly password: string;
      readonly ssid: string;
    }
  | {
      readonly type: typeof QRCodeType.EMAIL;
      readonly body: string;
      readonly email: string;
      readonly subject: string;
    }
  | {
      readonly type: typeof QRCodeType.PHONE;
      readonly phone: string;
    }
  | {
      readonly type: typeof QRCodeType.SMS;
      readonly message: string;
      readonly phone: string;
    }
  | {
      readonly type: typeof QRCodeType.CALENDAR;
      readonly description: string;
      readonly end: string;
      readonly location: string;
      readonly start: string;
      readonly title: string;
    };
