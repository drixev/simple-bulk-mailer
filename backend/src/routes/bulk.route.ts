import {
  MailBulkPayload,
  MailBulkPayloadSchema,
  Recipient,
} from "@/schemas/mail-bulk-payload.schema";
import { loadConfig } from "@/services/config";
import { sendMail } from "@/services/mailer";
import { FastifyInstance } from "fastify";

function replacePlaceholders(template: string, recipient: Recipient): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => recipient[key as keyof Recipient] || "",
  );
}

export async function bulkRoute(app: FastifyInstance) {
  app.route({
    url: "/",
    method: "POST",
    schema: {
      body: MailBulkPayloadSchema,
    },
    handler: async (request, reply) => {
      const { smtp: config } = await loadConfig();

      if (!config) {
        return reply
          .code(400)
          .send({ success: false, error: "SMTP not configured" });
      }

      const payload = request.body as MailBulkPayload;

      const results: {
        email: string;
        success: boolean;
        messageId?: string;
        error?: string;
      }[] = [];

      for (const recipient of payload.recipients) {
        const subject = replacePlaceholders(payload.subject, recipient);
        const html = replacePlaceholders(payload.html, recipient);

        try {
          const { messageId } = await sendMail(config, {
            from: config.user,
            to: recipient.email,
            subject,
            html,
          });

          results.push({ email: recipient.email, success: true, messageId });
        } catch (err) {
          results.push({
            email: recipient.email,
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }

        if (payload.delayMs) {
          await new Promise((res) => setTimeout(res, payload.delayMs));
        }
        
      }
      
      return reply.send({ results });

    },
  });
}
