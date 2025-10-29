import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyInstance } from 'fastify';
import { createTopics } from './create-topics';
import { deleteTopic } from './delete-topic';
import { updateTopic } from './update-topic';

export async function topicsRoutes(app: FastifyInstance) {
  app.post(
    '/projects/:projectId/disciplines/:disciplineId/topics/create',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    createTopics,
  );

  app.post(
    '/projects/:projectId/topics/:topicId/delete',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    deleteTopic,
  );

  app.put(
    '/projects/:projectId/disciplines/:disciplineId/topics/:topicId/update',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    updateTopic,
  );
}
