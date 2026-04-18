import Type, { Static } from "typebox";

export const MailConfigSchema = Type.Object({
  user: Type.String(),
  password: Type.String(),
  host: Type.String(),
  port: Type.Number(),
  secure: Type.Boolean()  // true for SSL (465), false for STARTTLS (587) or Bridge (1025)
});

export type MailConfig = Static<typeof MailConfigSchema>;

//NOtes:
/*
Preset          | Host                | Port  | Secure
------------------------------------------------
Proton Bridge   | 127.0.0.1           | 1025  | false
Gmail           | smtp.gmail.com      | 587   | false  
Outlook/Hotmail | smtp.office365.com  | 587   | false 
Proton Token    | smtp.protonmail.ch  | 587    | false
SendGrid        | smtp.sendgrid.net   | 587   | false
Custom          | —                   | —     | —
 */

