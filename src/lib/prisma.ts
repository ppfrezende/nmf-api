import { _env } from '@/env';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: _env.success && _env.data.NODE_ENV === 'dev' ? ['query'] : [],
});
