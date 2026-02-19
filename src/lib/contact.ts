export type ContactInfo = {
  fullName: string;
  phone: string;
  email: string;
  organization?: string;
  title?: string;
  note?: string;
  photoBase64?: string;
};

const defaultNote = "Shared via Creative Juice";

const escapeVCardValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  const lastName = parts.pop() ?? "";
  return { firstName: parts.join(" "), lastName };
};

const foldVCardLine = (line: string, lineBreak: string, width = 74) => {
  if (line.length <= width) {
    return line;
  }

  const parts: string[] = [];
  for (let index = 0; index < line.length; index += width) {
    const chunk = line.slice(index, index + width);
    parts.push(index === 0 ? chunk : ` ${chunk}`);
  }
  return parts.join(lineBreak);
};

export const isIosUserAgent = (userAgent: string) => /iPad|iPhone|iPod/i.test(userAgent);

export const isSamsungDevice = (userAgent: string) =>
  /SamsungBrowser|SAMSUNG|SM-[A-Z0-9]+/i.test(userAgent);

export const normalizePhoneForVCard = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const cleaned = trimmed.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  return digitsOnly.length > 0 ? `+${digitsOnly}` : "";
};

export const normalizePhoneForDisplay = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
};

export const deriveNameFromEmail = (email: string) => {
  const localPart = email.split("@")[0]?.trim();
  if (!localPart) {
    return "Shared Contact";
  }

  const words = localPart.replace(/[._-]+/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "Shared Contact";
  }

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const buildVCardPayload = (contact: ContactInfo, userAgent = "") => {
  const samsungMode = isSamsungDevice(userAgent);
  const phone = normalizePhoneForVCard(contact.phone);
  const { firstName, lastName } = splitName(contact.fullName || "Shared Contact");
  const lineBreak = "\r\n";
  const photoPrefix = samsungMode
    ? "PHOTO;ENCODING=BASE64;TYPE=PNG:"
    : "PHOTO;ENCODING=b;TYPE=PNG:";
  const photoLine = contact.photoBase64
    ? foldVCardLine(`${photoPrefix}${contact.photoBase64}`, lineBreak)
    : "";

  const lines = samsungMode
    ? [
        "BEGIN:VCARD",
        "VERSION:2.1",
        `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
        `FN:${escapeVCardValue(contact.fullName)}`,
        photoLine,
        contact.organization ? `ORG:${escapeVCardValue(contact.organization)}` : "",
        contact.title ? `TITLE:${escapeVCardValue(contact.title)}` : "",
        `TEL;CELL:${phone}`,
        `EMAIL;INTERNET:${escapeVCardValue(contact.email)}`,
        `NOTE:${escapeVCardValue(contact.note || defaultNote)}`,
        "END:VCARD",
      ]
    : [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
        `FN:${escapeVCardValue(contact.fullName)}`,
        photoLine,
        contact.organization ? `ORG:${escapeVCardValue(contact.organization)}` : "",
        contact.title ? `TITLE:${escapeVCardValue(contact.title)}` : "",
        `TEL;TYPE=CELL,VOICE:${phone}`,
        `EMAIL;TYPE=INTERNET:${escapeVCardValue(contact.email)}`,
        `NOTE:${escapeVCardValue(contact.note || defaultNote)}`,
        "END:VCARD",
      ];

  return lines.filter(Boolean).join(lineBreak);
};

export const triggerVCardDownload = (filename: string, payload: string) => {
  const blob = new Blob([payload], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const buildSmsIntent = (recipientPhone: string, message: string, userAgent: string) => {
  const encodedMessage = encodeURIComponent(message);
  const separator = isIosUserAgent(userAgent) ? "&" : "?";
  const smsPhone = normalizePhoneForVCard(recipientPhone);
  return `sms:${smsPhone}${separator}body=${encodedMessage}`;
};

export const buildShareContactLink = (
  origin: string,
  input: { name: string; email: string; phone: string }
) => {
  const params = new URLSearchParams({
    name: input.name,
    email: input.email,
    phone: input.phone,
  });
  return `${origin}/share-contact?${params.toString()}`;
};

const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

export const loadPngAsBase64 = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load image: ${path}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return uint8ArrayToBase64(new Uint8Array(arrayBuffer));
};
