import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      status: 'healthy',
      database: 'MongoDB Atlas (Cluster0)',
      connected: true,
      collections: {
        users: userCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido al conectar a la base de datos';
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'MongoDB Atlas',
        connected: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
