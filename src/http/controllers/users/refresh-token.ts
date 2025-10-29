import { prisma } from '@/lib/prisma';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true });
  const { role, sid, sub } = request.user;

  const session = await prisma.userSession.findUnique({ where: { id: sid } });
  if (!session || session.revokedAt) {
    return reply
      .status(401)
      .send({ code: 'session.invalid', message: 'Invalid or revoked session' });
  }

  const token = await reply.jwtSign(
    { role, sid },
    { sign: { sub, expiresIn: '15m' } },
  );

  const newRefreshToken = await reply.jwtSign(
    { role, sid, typ: 'refresh' },
    { sign: { sub, expiresIn: '30d' } },
  );
  return reply
    .setCookie('refreshToken', newRefreshToken, {
      path: '/',
      //secure: true,
      sameSite: 'strict',
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    });
}
