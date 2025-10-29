import { prisma } from '@/lib/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { clientIp, uaHash } from './utils';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<{
      sub: string;
      role: string;
      sid: string;
    }>();

    const session = await prisma.userSession.findUnique({
      where: { id: payload.sid },
    });

    if (!session || session.revokedAt) {
      return reply.status(401).send({
        code: 'session.invalid',
        message: 'Invalid or revoked session',
      });
    }

    const uaOk =
      !session.userAgentHash ||
      session.userAgentHash ===
        uaHash(request.headers['user-agent'] as string | undefined);
    const ipOk = true;
    if (!uaOk || !ipOk)
      return reply
        .status(401)
        .send({ code: 'session.device_mismatch', message: 'Device mismatch' });

    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date(), ip: clientIp(request) },
    });

    await request.jwtVerify();
  } catch (err) {
    return reply
      .status(401)
      .send({ code: 'token.expired', message: 'Unauthorized' });
  }
}
