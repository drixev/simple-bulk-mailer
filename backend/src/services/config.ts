import { MailConfig } from "@/schemas/mail-config.schema";
import fs from "fs-extra";
import path from "path";

const CONFIG_PATH = path.join(import.meta.dirname, "../../config.json");

export interface AppConfig {
  smtp: MailConfig | null;
}

export async function loadConfig(): Promise<AppConfig> {
  const exists = await fs.pathExists(CONFIG_PATH);
  if (!exists) return { smtp: null };
  const data: AppConfig = await fs.readJSON(CONFIG_PATH);
  return data;
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
}
