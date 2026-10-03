import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra (seed) de cuentas de prueba para HU-001 (CGB-6)...');

  const claveAdmin = 'Admin2026!*';
  const claveColab = 'Colab2026!*';

  const hashAdmin = await hash(claveAdmin, 10);
  const hashColab = await hash(claveColab, 10);

  // 1. Cuenta de Administrador de pruebas
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cgb.latam' },
    update: {
      name: 'Administrador Institucional',
      role: 'ADMINISTRADOR',
      passwordHash: hashAdmin,
      activo: true,
    },
    create: {
      email: 'admin@cgb.latam',
      name: 'Administrador Institucional',
      role: 'ADMINISTRADOR',
      passwordHash: hashAdmin,
      activo: true,
    },
  });

  console.log(`✅ Administrador configurado: ${admin.email} (Rol: ${admin.role}, Activo: ${admin.activo})`);

  // 2. Cuenta de Colaborador de pruebas
  const colaborador = await prisma.user.upsert({
    where: { email: 'colaborador@cgb.latam' },
    update: {
      name: 'Colaborador Académico',
      role: 'COLABORADOR',
      passwordHash: hashColab,
      activo: true,
    },
    create: {
      email: 'colaborador@cgb.latam',
      name: 'Colaborador Académico',
      role: 'COLABORADOR',
      passwordHash: hashColab,
      activo: true,
    },
  });

  console.log(`✅ Colaborador configurado: ${colaborador.email} (Rol: ${colaborador.role}, Activo: ${colaborador.activo})`);
  console.log('✨ Siembra completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
