import { config } from "dotenv";

if (process.env.NODE_ENV === "production") {
  config({ path: ".env" });
} else {
  config({ path: ".env.local" });
}

import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("src", "db", "schema.prisma"),
} satisfies PrismaConfig;
