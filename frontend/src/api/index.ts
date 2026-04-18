import axios from "axios";
import type { BulkPayload, SendPayload, SmtpConfig } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const settingsApi = {
  get: async (): Promise<{ configured: boolean; smtp?: SmtpConfig }> => {
    const res = await api.get("api/settings");
    return res.data;
  },
  save: async (
    config: SmtpConfig & { password: string },
  ): Promise<{ success: boolean }> => {
    const res = await api.post("api/settings", config);
    return res.data;
  },
  test: async (): Promise<{ connected: boolean; error?: string }> => {
    const res = await api.post("api/settings/test");
    return res.data;
  },
};

export const mailApi = {
  send: async (
    body: SendPayload,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const res = await api.post("/api/send", body);
    return res.data;
  },
  bulk: async(body: BulkPayload)=>{
    const res = await api.post('/api/bulk', body);
    return res.data;
  }
};
