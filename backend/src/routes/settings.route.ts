import { MailConfig, MailConfigSchema } from "@/schemas/mail-config.schema";
import { loadConfig, saveConfig } from "@/services/config";
import { verifyConnection } from "@/services/mailer";
import { FastifyInstance } from "fastify";

export async function settingsRoute(app: FastifyInstance) {
  app.route({
    url: "/",
    method: "GET",
    handler: async (_request, reply) => {
      const config = await loadConfig();
      if (!config.smtp) return reply.send({ configured: false });

      const { password, ...safe } = config.smtp;
      return reply.send({ configured: true, config: safe });
    },
  });

  app.route({
    url: "/",
    method: "POST",
    schema: {
      body: MailConfigSchema,
    },
    handler: async (request, reply) => {
      const smtp = request.body as MailConfig;

      await saveConfig({ smtp });
      return reply.code(200).send({ success: true });
    },
  });

  app.route({
    url: "/test",
    method: "POST",
    handler: async (_request, reply) => {
      const config = await loadConfig();
      if (!config.smtp) return reply.code(400).send({ connected: false, error: "SMTP not configured"     });

      const ok = await verifyConnection(config.smtp);

      return reply.send({ connected: ok });
    },
  });
}
