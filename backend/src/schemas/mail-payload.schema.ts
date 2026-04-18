import Type, { Static } from "typebox";

export const MailPayloadSchema = Type.Object({
  from: Type.String(),
  to: Type.String(),
  subject: Type.String(),
  html: Type.String(),
});

export type MailPayload = Static<typeof MailPayloadSchema>;
