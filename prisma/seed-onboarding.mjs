import { PrismaClient } from '@prisma/client';
import { sembrarPuestosRutas } from './onboarding-seed.mjs';

const prisma = new PrismaClient();

try {
  await sembrarPuestosRutas(prisma);
} finally {
  await prisma.$disconnect();
}