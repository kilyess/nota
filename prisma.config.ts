import { config } from "dotenv";

if (process.env.NODE_ENV === "production") {
  config({ path: ".env" });
} else {
  config({ path: ".env.local" });
}

import path from "node:path";
import { defineConfig } from "prisma/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Define it in .env/.env.local or your environment before running Prisma commands.",
  );
}

const DIRECT_URL = process.env.DIRECT_URL;

export default defineConfig({
  schema: path.join("src", "db", "schema.prisma"),
  datasource: {
    url: DATABASE_URL,
    ...(DIRECT_URL ? { directUrl: DIRECT_URL } : {}),
  },
});
