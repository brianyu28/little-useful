declare module "qrcode" {
  interface QRCodeToDataURLOptions {
    readonly color?: {
      readonly dark?: string;
      readonly light?: string;
    };
    readonly errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    readonly margin?: number;
    readonly scale?: number;
    readonly type?: string;
    readonly width?: number;
  }

  interface QRCodeModule {
    readonly toDataURL: (
      text: string,
      options?: QRCodeToDataURLOptions,
    ) => Promise<string>;
  }

  const QRCode: QRCodeModule;
  export default QRCode;
}
