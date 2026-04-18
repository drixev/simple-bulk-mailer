import { MailPayload, MailPayloadSchema } from "@/schemas/mail-payload.schema";
import { loadConfig } from "@/services/config";
import { sendMail } from "@/services/mailer";
import { FastifyInstance } from "fastify";

export async function sendRoute(app: FastifyInstance) {
  app.route({
    url: "/",
    method: "POST",
    schema: {
      body: MailPayloadSchema,
    },
    handler: async (request, reply) => {
      const { smtp: config } = await loadConfig();

      if (!config) {
        return reply
          .code(400)
          .send({ success: false, error: "SMTP not configured" });
      }

      try {

        const payload  = request.body as MailPayload;
        
        const { messageId } = await sendMail(config, payload);
        return reply.send({ success: true, messageId });
      } catch (err) {
        return reply
          .code(500)
          .send({
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
      }
    },
  });
}
