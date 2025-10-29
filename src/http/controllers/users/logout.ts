import { prisma } from '@/lib/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function userLogout(request: FastifyRequest, reply: FastifyReply) {
  const { sid } = request.user;
  await prisma.userSession.update({
    where: { id: sid },
    data: { revokedAt: new Date() },
  });
  return reply.clearCookie('refreshToken', { path: '/' }).status(200).send();
}
