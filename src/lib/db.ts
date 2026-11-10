import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return undefined;
  }

  const url = new URL(databaseUrl);
  if (url.port === "6543") {
    url.searchParams.set("pgbouncer", "true");
  }

  return url.toString();
}

const databaseUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
