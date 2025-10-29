import fastify from 'fastify';
import cors from '@fastify/cors';
// import { usersRoutes } from './http/controllers/users-admin/routes';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { usersRoutes } from './http/controllers/users/routes';
import { projectsRoutes } from './http/controllers/projects/routes';
import { disciplinesRoutes } from './http/controllers/projects/disciplines/routes';
import { topicsRoutes } from './http/controllers/projects/disciplines/topics/routes';
import { cyclesRoutes } from './http/controllers/projects/cycles/routes';
import { studySessionsRoutes } from './http/controllers/projects/study-sessions/routes';

export const app = fastify();

app.register(cors, {
  exposedHeaders: [
    'x-total-count',
    'x-page-count',
    // 'x-year-value',
    // 'x-month-value',
  ],
  // origin: 'http://localhost:3000',
  // credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
});

app.register(fastifyCookie);

// app.addHook('onRequest', async (request) => {
//   try {
//     await request.jwtVerify();

//     const user = request.user as { sub: string; name: string; role: string };

//     console.log(
//       `[${new Date().toISOString()}] ${request.method} ${
//         request.url
//       } - UserId: ${user.sub}, UserName: ${user.name}, Role: ${user.role}`,
//     );
//   } catch (err) {
//     console.log(
//       `[${new Date().toISOString()}] ${request.method} ${
//         request.url
//       } - User: Not Authenticated`,
//     );
//   }
// });

app.register(usersRoutes);
app.register(projectsRoutes);
app.register(cyclesRoutes);
app.register(disciplinesRoutes);
app.register(topicsRoutes);
app.register(studySessionsRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error' });
});
