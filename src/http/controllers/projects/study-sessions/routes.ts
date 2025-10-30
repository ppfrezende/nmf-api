import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyInstance } from 'fastify';
import { createStudySession } from './create-study-session';
import { getStudiedTopicsByCycle } from './get-studied-topics-by-cycle';
import { updateStudySession } from './update-study-session';
import { getStudySession } from './get-study-session';
import { deleteStudySession } from './delete-study-session';
import { getStudySessionsByProject } from './get-study-sessions-by-project';

export async function studySessionsRoutes(app: FastifyInstance) {
  app.post(
    '/projects/:projectId/cycles/:cycleId',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    createStudySession,
  );

  app.get(
    '/projects/:projectId/cycles/:cycleId/get',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getStudiedTopicsByCycle,
  );

  app.get(
    '/projects/:projectId/study-session/:studySessionId',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getStudySession,
  );

  app.get(
    '/projects/:projectId/study-sessions',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getStudySessionsByProject,
  );

  app.put(
    '/projects/:projectId/study-sessions/:studySessionId/update',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    updateStudySession,
  );

  app.post(
    '/projects/:projectId/study-sessions/:studySessionId/delete',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    deleteStudySession,
  );
}
