// Service catalog controller.
//
// GET is available to any authenticated user (customer/worker/admin all
// need to read the catalog). Create/update/delete are ADMIN-only,
// enforced by the `authorize("ADMIN")` middleware in the route file —
// never by anything checked in here.

import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { validateServiceInput } from "../utils/validators.js";

export async function listServices(req, res) {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return res.status(200).json({ services });
}

export async function createService(req, res) {
  const { name, category, description } = req.body;

  const errors = validateServiceInput({ name, category, description });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const trimmedName = name.trim();
  const existing = await prisma.service.findUnique({ where: { name: trimmedName } });
  if (existing) {
    return res.status(409).json({ error: "A service with this name already exists." });
  }

  const service = await prisma.service.create({
    data: {
      name: trimmedName,
      category: category?.trim() || null,
      description: description?.trim() || null,
    },
  });

  return res.status(201).json({ service });
}

export async function updateService(req, res) {
  const { id } = req.params;
  const { name, category, description } = req.body;

  const existingService = await prisma.service.findUnique({ where: { id } });
  if (!existingService) {
    return res.status(404).json({ error: "Service not found." });
  }

  const errors = validateServiceInput({ name, category, description });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const trimmedName = name.trim();
  if (trimmedName.toLowerCase() !== existingService.name.toLowerCase()) {
    const duplicate = await prisma.service.findUnique({ where: { name: trimmedName } });
    if (duplicate) {
      return res.status(409).json({ error: "A service with this name already exists." });
    }
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: trimmedName,
      category: category?.trim() || null,
      description: description?.trim() || null,
    },
  });

  return res.status(200).json({ service });
}

export async function deleteService(req, res) {
  const { id } = req.params;

  try {
    await prisma.service.delete({ where: { id } });
    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Service not found." });
      }
      if (err.code === "P2003" || err.code === "P2014") {
        // The schema has no cascading delete for Service -> Booking /
        // DemandRecord (a deliberate, conservative default — see Phase 1
        // notes). This is the expected, safe way that shows up here.
        return res.status(409).json({
          error:
            "This service can't be deleted because it's already referenced by bookings or demand records.",
        });
      }
    }
    console.error("deleteService error:", err);
    return res.status(500).json({ error: "Something went wrong deleting the service." });
  }
}
