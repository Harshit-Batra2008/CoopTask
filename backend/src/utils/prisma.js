// Single shared Prisma client instance, imported wherever the backend
// needs to talk to the database. Keeping one instance avoids opening
// many separate database connections.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
