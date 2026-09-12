import { definePrismaConfig } from "prisma/config";
import { defineConfig as definePostgresConfig } from "@prisma/orm-postgres/config";
import { getDatabaseUrl } from "./src/index.js";

export default definePrismaConfig({
  orm: definePostgresConfig({
    contract: "prisma/contract.prisma",
    output: "generated/prisma8",
    db: {
      connection: getDatabaseUrl(),
    },
  }),
});
