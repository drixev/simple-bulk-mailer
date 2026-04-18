export interface Recipient {
  email: string;
  name?: string;
  [name: string]: string | undefined;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
}

export interface SendPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface BulkPayload {
  recipients: Recipient[];
  subject: string;
  html: string;
  delayMs: number;
}

export interface SendResult {
  email: string;
  succes: boolean;
  error?: string;
}

export interface BulkResult {
  results: SendResult[];
}

export type SmtpPreset =
  | "proton-bridge"
  | "proton-token"
  | "gmail"
  | "outlook"
  | "sendgrid"
  | "custom";

export interface PresetConfig {
  label: string;
  host: string;
  port: number;
  secure: boolean;
}

export const SMTP_PRESETS: Record<SmtpPreset, PresetConfig> = {
  "proton-bridge": {
    label: "Proton Bridge",
    host: "127.0.0.1",
    port: 1025,
    secure: false,
  },
  "proton-token": {
    label: "Proton SMTP Token",
    host: "smtp.protonmail.ch",
    port: 587,
    secure: false,
  },
  gmail: {
    label: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
  outlook: {
    label: "Outlook",
    host: "smtp.office365.com",
    port: 587,
    secure: false,
  },
  sendgrid: {
    label: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
  },
  custom: {
    label: "Custom",
    host: "",
    port: 587,
    secure: false,
  },
};
