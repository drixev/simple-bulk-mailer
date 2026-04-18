import { MailConfig } from "@/schemas/mail-config.schema";
import { MailPayload } from "@/schemas/mail-payload.schema";
import nodemailer from "nodemailer";

export function createTransport(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendMail(config: MailConfig, payload: MailPayload) {
  const transporter = createTransport(config);
  return transporter.sendMail({
    from: payload.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

export async function verifyConnection(config: MailConfig) {
  try {
    const transporter = createTransport(config);
    const status = await transporter.verify();
    return status;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
}
