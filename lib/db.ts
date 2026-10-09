import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pgPool: Pool | undefined;
};

const pool =
    globalForPrisma.pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
    });

const adapter = new PrismaPg(pool);

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
    globalForPrisma.pgPool = pool;
}