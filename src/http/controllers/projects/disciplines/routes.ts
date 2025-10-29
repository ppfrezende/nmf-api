import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyInstance } from 'fastify';
import { createDisciplines } from './create-disciplines';
import { reorderDisciplines } from './reorder-disciplines';
import { deleteDiscipline } from './delete-discipline';
import { updateDiscipline } from './update-discipline';
import { getTotalDisciplinesStats } from './get-total-disciplines-stats';

export async function disciplinesRoutes(app: FastifyInstance) {
  app.post(
    '/projects/:projectId/disciplines/create',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    createDisciplines,
  );

  app.patch(
    '/projects/:projectId/disciplines/reorder',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    reorderDisciplines,
  );

  app.put(
    '/projects/:projectId/disciplines/:disciplineId',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    updateDiscipline,
  );

  app.post(
    '/projects/:projectId/disciplines/:disciplineId/delete',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    deleteDiscipline,
  );

  app.post(
    '/projects/:projectId/total-discipline-stats',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getTotalDisciplinesStats,
  );
}
