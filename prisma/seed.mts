import { db } from "@/lib/db";

// Idempotent dev seed: the single MVP workflow and its default config.
// Re-running must not create duplicates (upsert by stable keys).
// Uses .mts so tsx runs it as ESM, matching the generated Prisma client.
async function main() {
  const workflow = await db.workflow.upsert({
    where: { key: "import-leads-to-crm" },
    update: {},
    create: {
      key: "import-leads-to-crm",
      name: "Import Leads to CRM",
      description:
        "Import leads from CSV/Excel, validate and create them in the target CRM.",
    },
  });

  await db.workflowConfig.upsert({
    where: { workflowId: workflow.id },
    update: {},
    create: {
      workflowId: workflow.id,
      // Default column→CRM field mapping; refined once the CRM is chosen.
      mapping: {
        Name: "name",
        Email: "email",
        Phone: "phone",
        Company: "company",
        Source: "source",
      },
      // MVP decision: normalized email is the duplicate key.
      dedupeField: "email",
    },
  });

  console.log(`Seeded workflow "${workflow.key}" (${workflow.id})`);
}

try {
  await main();
} finally {
  await db.$disconnect();
}
