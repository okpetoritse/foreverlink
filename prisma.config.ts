import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 🏗️ The CLI uses this file exclusively, so we give it the Direct URL (Port 5432)
    url: env("DIRECT_URL"),
  },
});