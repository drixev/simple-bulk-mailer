import Type, { Static } from "typebox";

export const RecipientSchema = Type.Object({
  email: Type.String(),
  name: Type.Optional(Type.String()),
});

export type Recipient = Static<typeof RecipientSchema>;

export const MailBulkPayloadSchema = Type.Object({
  recipients: Type.Array(RecipientSchema),
  subject: Type.String(),
  html: Type.String(),
  delayMs: Type.Optional(Type.Number()),
});

export type MailBulkPayload = Static<typeof MailBulkPayloadSchema>;
