import { config } from "dotenv";
config({ path: ".env.local" });

import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("src", "db", "schema.prisma"),
} satisfies PrismaConfig;
