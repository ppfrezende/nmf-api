import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyInstance } from 'fastify';
import { createProject } from './create-project';
import { getProjectsListByUser } from './get-projects-list-by-user';
import { getProjectByUser } from './get-project-by-user';
import { updateProjectDetails } from './update-project-details';
import { deleteUserProject } from './delete-project';
import { getTotalProjectStats } from './get-total-project-stats';

export async function projectsRoutes(app: FastifyInstance) {
  app.post(
    '/projects/create',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    createProject,
  );

  app.get(
    '/projects',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getProjectsListByUser,
  );

  app.get(
    '/projects/:projectId',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getProjectByUser,
  );

  app.put(
    '/projects/:projectId/update',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    updateProjectDetails,
  );

  app.post(
    '/projects/:projectId/delete',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    deleteUserProject,
  );

  app.post(
    '/projects/:projectId/total-project-stats',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    getTotalProjectStats,
  );
}
