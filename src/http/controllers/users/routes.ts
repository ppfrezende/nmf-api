import { FastifyInstance } from 'fastify';
import { createUser } from './create-user';
import { authenticate } from './authenticate';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { userSelfProfile } from './user-self-profile';
import { refreshToken } from './refresh-token';
import { getUsersList } from './get-users-list';
import { userLogout } from './logout';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
  app.post(
    '/logout',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])] },
    userLogout,
  );
  app.patch('/token/refresh', refreshToken);

  app.post('/users', createUser);
  app.get(
    '/me',
    {
      onRequest: [verifyJWT, verifyUserRole(['ADMIN', 'MEMBER'])],
    },
    userSelfProfile,
  );

  app.get(
    '/users',
    { onRequest: [verifyJWT, verifyUserRole(['ADMIN'])] },
    getUsersList,
  );
}
