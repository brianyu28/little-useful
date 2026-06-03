import {
  Alert,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Download, QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "qrcode";
import React from "react";
import ToolPage from "../../components/ToolPage";
import QRCodeInstructions from "./components/QRCodeInstructions";
import styles from "./QRCode.module.scss";
import { QRCodeConfig } from "./QRCodeConfig";
import type { ErrorCorrectionLevel } from "./types/ErrorCorrectionLevel";
import type { QRCodePayload } from "./types/QRCodePayload";
import { QRCodeType } from "./types/QRCodeType";
import { createQRCodeString } from "./utils/createQRCodeString";

const errorCorrectionOptions = [
  { label: "Low (7%)", value: "L" },
  { label: "Medium (15%)", value: "M" },
  { label: "Quartile (25%)", value: "Q" },
  { label: "High (30%)", value: "H" },
];

const qrCodeTypeOptions = [
  { label: "URL", value: QRCodeType.URL },
  { label: "Text", value: QRCodeType.TEXT },
  { label: "Wi-Fi", value: QRCodeType.WIFI },
  { label: "Email", value: QRCodeType.EMAIL },
  { label: "Phone", value: QRCodeType.PHONE },
  { label: "Text Message", value: QRCodeType.SMS },
  { label: "Calendar Event", value: QRCodeType.CALENDAR },
];

interface QRCodeFormValues {
  readonly calendarDescription: string;
  readonly calendarEnd: string;
  readonly calendarLocation: string;
  readonly calendarStart: string;
  readonly calendarTitle: string;
  readonly email: string;
  readonly emailBody: string;
  readonly emailSubject: string;
  readonly phone: string;
  readonly smsMessage: string;
  readonly smsPhone: string;
  readonly text: string;
  readonly url: string;
  readonly wifiEncryption: string;
  readonly wifiHidden: boolean;
  readonly wifiPassword: string;
  readonly wifiSsid: string;
}

const initialValues: QRCodeFormValues = {
  calendarDescription: "",
  calendarEnd: "",
  calendarLocation: "",
  calendarStart: "",
  calendarTitle: "",
  email: "",
  emailBody: "",
  emailSubject: "",
  phone: "",
  smsMessage: "",
  smsPhone: "",
  text: "",
  url: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  wifiPassword: "",
  wifiSsid: "",
};

function getPromptLabel(type: QRCodeType) {
  switch (type) {
    case QRCodeType.URL:
      return "URL";
    case QRCodeType.TEXT:
      return "Text";
    case QRCodeType.WIFI:
      return "Wi-Fi network";
    case QRCodeType.EMAIL:
      return "Email";
    case QRCodeType.PHONE:
      return "Phone number";
    case QRCodeType.SMS:
      return "Text message";
    case QRCodeType.CALENDAR:
      return "Calendar event";
  }
}

function hasRequiredValues(type: QRCodeType, values: QRCodeFormValues) {
  switch (type) {
    case QRCodeType.URL:
      return Boolean(values.url.trim());
    case QRCodeType.TEXT:
      return Boolean(values.text.trim());
    case QRCodeType.WIFI:
      return (
        Boolean(values.wifiSsid.trim()) &&
        (values.wifiEncryption === "nopass" ||
          Boolean(values.wifiPassword.trim()))
      );
    case QRCodeType.EMAIL:
      return Boolean(values.email.trim());
    case QRCodeType.PHONE:
      return Boolean(values.phone.trim());
    case QRCodeType.SMS:
      return Boolean(values.smsPhone.trim());
    case QRCodeType.CALENDAR:
      return Boolean(
        values.calendarTitle.trim() &&
        values.calendarStart &&
        values.calendarEnd,
      );
  }
}

function getQRCodePayload(
  type: QRCodeType,
  values: QRCodeFormValues,
): QRCodePayload {
  switch (type) {
    case QRCodeType.URL:
      return {
        type,
        url: values.url,
      };
    case QRCodeType.TEXT:
      return {
        type,
        text: values.text,
      };
    case QRCodeType.WIFI:
      return {
        type,
        encryption: values.wifiEncryption,
        isHidden: values.wifiHidden,
        password: values.wifiPassword,
        ssid: values.wifiSsid,
      };
    case QRCodeType.EMAIL:
      return {
        type,
        body: values.emailBody,
        email: values.email,
        subject: values.emailSubject,
      };
    case QRCodeType.PHONE:
      return {
        type,
        phone: values.phone,
      };
    case QRCodeType.SMS:
      return {
        type,
        message: values.smsMessage,
        phone: values.smsPhone,
      };
    case QRCodeType.CALENDAR:
      return {
        type,
        description: values.calendarDescription,
        end: values.calendarEnd,
        location: values.calendarLocation,
        start: values.calendarStart,
        title: values.calendarTitle,
      };
  }
}

export default function QRCodeTool() {
  const [type, setType] = React.useState<QRCodeType>(QRCodeType.URL);
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    React.useState<ErrorCorrectionLevel>("M");
  const [values, setValues] = React.useState(initialValues);
  const [dataUrl, setDataUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const isGenerateEnabled = hasRequiredValues(type, values);

  const updateValue = React.useCallback(
    <TKey extends keyof QRCodeFormValues>(
      key: TKey,
      value: QRCodeFormValues[TKey],
    ) => {
      setValues((currentValues) => ({ ...currentValues, [key]: value }));
      setError("");
    },
    [],
  );

  const handleGenerate = React.useCallback(async () => {
    const qrCodeString = createQRCodeString(getQRCodePayload(type, values));
    if (!qrCodeString) {
      setDataUrl("");
      setError(`Enter ${getPromptLabel(type).toLowerCase()} details first.`);
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const nextDataUrl = await QRCode.toDataURL(qrCodeString, {
        errorCorrectionLevel,
        margin: 2,
        scale: 8,
        type: "image/png",
        width: 512,
      });
      setDataUrl(nextDataUrl);
    } catch {
      setDataUrl("");
      setError("That input could not be converted into a QR code.");
    } finally {
      setIsGenerating(false);
    }
  }, [errorCorrectionLevel, type, values]);

  const renderTypeFields = () => {
    switch (type) {
      case QRCodeType.URL:
        return (
          <TextInput
            label="URL"
            onChange={(event) => updateValue("url", event.currentTarget.value)}
            placeholder="https://example.com"
            required
            value={values.url}
          />
        );
      case QRCodeType.TEXT:
        return (
          <Textarea
            autosize
            label="Text"
            minRows={4}
            onChange={(event) => updateValue("text", event.currentTarget.value)}
            placeholder="Text to encode"
            required
            value={values.text}
          />
        );
      case QRCodeType.WIFI:
        return (
          <Stack gap="sm">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <TextInput
                label="Network name"
                onChange={(event) =>
                  updateValue("wifiSsid", event.currentTarget.value)
                }
                placeholder="SSID"
                required
                value={values.wifiSsid}
              />
              <Select
                allowDeselect={false}
                data={[
                  { label: "WPA/WPA2", value: "WPA" },
                  { label: "WEP", value: "WEP" },
                  { label: "No password", value: "nopass" },
                ]}
                label="Security"
                onChange={(value) =>
                  updateValue("wifiEncryption", value ?? "WPA")
                }
                required
                value={values.wifiEncryption}
              />
            </SimpleGrid>
            {values.wifiEncryption !== "nopass" && (
              <PasswordInput
                label="Password"
                onChange={(event) =>
                  updateValue("wifiPassword", event.currentTarget.value)
                }
                required
                value={values.wifiPassword}
              />
            )}
            <Checkbox
              checked={values.wifiHidden}
              label="Hidden network"
              onChange={(event) =>
                updateValue("wifiHidden", event.currentTarget.checked)
              }
            />
          </Stack>
        );
      case QRCodeType.EMAIL:
        return (
          <Stack gap="sm">
            <TextInput
              label="Email address"
              onChange={(event) =>
                updateValue("email", event.currentTarget.value)
              }
              placeholder="hello@example.com"
              required
              value={values.email}
            />
            <TextInput
              label="Subject"
              onChange={(event) =>
                updateValue("emailSubject", event.currentTarget.value)
              }
              value={values.emailSubject}
            />
            <Textarea
              autosize
              label="Body"
              minRows={3}
              onChange={(event) =>
                updateValue("emailBody", event.currentTarget.value)
              }
              value={values.emailBody}
            />
          </Stack>
        );
      case QRCodeType.PHONE:
        return (
          <TextInput
            label="Phone number"
            onChange={(event) =>
              updateValue("phone", event.currentTarget.value)
            }
            placeholder="+1 555 123 4567"
            required
            value={values.phone}
          />
        );
      case QRCodeType.SMS:
        return (
          <Stack gap="sm">
            <TextInput
              label="Phone number"
              onChange={(event) =>
                updateValue("smsPhone", event.currentTarget.value)
              }
              placeholder="+1 555 123 4567"
              required
              value={values.smsPhone}
            />
            <Textarea
              autosize
              label="Message"
              minRows={3}
              onChange={(event) =>
                updateValue("smsMessage", event.currentTarget.value)
              }
              value={values.smsMessage}
            />
          </Stack>
        );
      case QRCodeType.CALENDAR:
        return (
          <Stack gap="sm">
            <TextInput
              label="Title"
              onChange={(event) =>
                updateValue("calendarTitle", event.currentTarget.value)
              }
              required
              value={values.calendarTitle}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <TextInput
                label="Starts"
                onChange={(event) =>
                  updateValue("calendarStart", event.currentTarget.value)
                }
                required
                type="datetime-local"
                value={values.calendarStart}
              />
              <TextInput
                label="Ends"
                onChange={(event) =>
                  updateValue("calendarEnd", event.currentTarget.value)
                }
                required
                type="datetime-local"
                value={values.calendarEnd}
              />
            </SimpleGrid>
            <TextInput
              label="Location"
              onChange={(event) =>
                updateValue("calendarLocation", event.currentTarget.value)
              }
              value={values.calendarLocation}
            />
            <Textarea
              autosize
              label="Description"
              minRows={3}
              onChange={(event) =>
                updateValue("calendarDescription", event.currentTarget.value)
              }
              value={values.calendarDescription}
            />
          </Stack>
        );
    }
  };

  return (
    <ToolPage
      description={QRCodeConfig.description}
      title="Generate QR Code"
      instructions={<QRCodeInstructions />}
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Text fw={600}>QR Code Type</Text>
          <div className={styles.typeControl}>
            <SegmentedControl
              data={qrCodeTypeOptions}
              fullWidth
              onChange={(value) => {
                setType(value);
                setError("");
              }}
              value={type}
            />
          </div>
        </Stack>

        {renderTypeFields()}

        <Select
          allowDeselect={false}
          data={errorCorrectionOptions}
          label="Error correction"
          onChange={(value) =>
            setErrorCorrectionLevel((value ?? "M") as ErrorCorrectionLevel)
          }
          required
          value={errorCorrectionLevel}
        />

        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        <Group justify="flex-start">
          <Button
            disabled={!isGenerateEnabled}
            leftSection={<QrCodeIcon size={16} />}
            loading={isGenerating}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </Group>

        {dataUrl && (
          <div className={styles.result}>
            <div className={styles.preview}>
              <img
                alt={`Generated ${QRCodeConfig.title}`}
                className={styles.image}
                src={dataUrl}
              />
            </div>
            <Group className={styles.actions}>
              <Button
                component="a"
                download="qrcode.png"
                href={dataUrl}
                leftSection={<Download size={16} />}
                variant="subtle"
              >
                Download
              </Button>
            </Group>
          </div>
        )}
      </Stack>
    </ToolPage>
  );
}
