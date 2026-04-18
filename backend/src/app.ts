import fastify from "fastify";
import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { bulkRoute } from "./routes/bulk.route";
import { sendRoute } from "./routes/send.route";
import { settingsRoute } from "./routes/settings.route";

export const buildApp = () => {
  const server = fastify({
    logger: true,
  });

  const corsOrigin = process.env.CORS_ORIGIN || "*";

  server.register(cors, {
    origin: (origin, cb) => {
      if (corsOrigin === "*") {
        cb(null, true);
        return;
      }

      const allowedOrigins = corsOrigin.split(",").map((o) => o.trim());

      if (!origin) {
        cb(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },

    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token",
      "X-Amz-User-Agent",
    ],
  });

  server.register(bulkRoute, {prefix: "/api/bulk"});
  server.register(sendRoute, {prefix: "/api/send"});
  server.register(settingsRoute, {prefix: "/api/settings"});

  server.withTypeProvider<TypeBoxTypeProvider>();

  return server;
};
