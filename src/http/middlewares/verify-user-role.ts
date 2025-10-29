import type { Role } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(rolesToVerify: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (!rolesToVerify.includes(role)) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  };
}
