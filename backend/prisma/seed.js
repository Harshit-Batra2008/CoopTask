// Controlled admin seed.
//
// This is the ONLY way an ADMIN user is created in this project. There
// is no public "become an admin" endpoint, and the register endpoint
// explicitly refuses role: "ADMIN" (see auth.controller.js). This
// script is meant to be run manually, once, by a developer with
// access to the .env file — not by an end user.
//
// Run with: npm run seed   (from backend/)

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_NAME = process.env.ADMIN_NAME || "CoopTask Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@cooptask.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL.toLowerCase() },
    update: {}, // if the admin already exists, leave it untouched
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin seed complete. Login with: ${admin.email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `No ADMIN_PASSWORD set in .env — used the default "${ADMIN_PASSWORD}". Change this for anything beyond local testing.`
    );
  }
}

main()
  .catch((err) => {
    console.error("Admin seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
