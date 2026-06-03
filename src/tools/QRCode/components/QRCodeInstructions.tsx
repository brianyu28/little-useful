import { Text } from "@mantine/core";

export default function QRCodeInstructions() {
  return (
    <>
      <Text mb="sm">
        Generate a QR code from a URL, text, Wi-Fi credentials, contact
        information, or calendar events.
      </Text>
      <Text mb="sm">
        Data is embedded in the QR code directly and does not use any external
        servers.
      </Text>
      <Text mb="sm">
        Error correction specifies how much of the QR code can be damaged or
        obscured and still be readable.
      </Text>
    </>
  );
}
