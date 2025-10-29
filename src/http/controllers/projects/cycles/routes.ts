import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyInstance } from 'fastify';
import { createCycle } from './create-cycle';
import { getCycle } from './get-cycle';
import { updateCycle } from './update-cycle';
import { getDisciplinesStatsByCycle } from './get-disciplines-by-cycle';
import { deleteCycle } from './delete-cycle';

export async function cyclesRoutes(app: FastifyInstance) {
  app.post(
    '/projects/:projectId/cycles/create',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    createCycle,
  );

  app.get(
    '/projects/:projectId/cycles/:cycleId',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getCycle,
  );

  app.put(
    '/projects/:projectId/cycles/:cycleId/update',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    updateCycle,
  );

  app.post(
    '/projects/:projectId/cycles/:cycleId/discipline-stats',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getDisciplinesStatsByCycle,
  );
  app.post(
    '/projects/:projectId/cycles/:cycleId/delete',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    deleteCycle,
  );
}
