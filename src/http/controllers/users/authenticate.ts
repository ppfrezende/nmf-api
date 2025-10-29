import { clientIp, uaHash } from '@/http/middlewares/utils';
import { prisma } from '@/lib/prisma';
import { InvalidCredentialsError } from '@/use-cases/_errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/_factories/users-factories/make-authenticate-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const autheticateUseCase = makeAuthenticateUseCase();

    const { user } = await autheticateUseCase.execute({
      email,
      password,
    });

    const { id, name, role } = user;

    const currentUa = uaHash(
      request.headers['user-agent'] as string | undefined,
    );
    const existing = await prisma.userSession.findFirst({
      where: { userId: user.id, revokedAt: null, userAgentHash: currentUa },
      orderBy: { lastSeenAt: 'desc' },
    });

    if (existing) {
      const session = await prisma.userSession.update({
        where: { id: existing.id },
        data: { lastSeenAt: new Date(), ip: clientIp(request) },
      });

      const token = await reply.jwtSign(
        { role: user.role, name: user.name, sid: session.id },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      );

      const refreshToken = await reply.jwtSign(
        { role: user.role, sid: session.id, typ: 'refresh' },
        {
          sign: {
            sub: user.id,
            expiresIn: '30d',
          },
        },
      );

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          //secure: true,
          sameSite: 'strict',
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
          // refreshToken,
          id,
          name,
          email,
          role,
        });
    } else {
      const session = await prisma.userSession.create({
        data: {
          userId: id,
          userAgentHash: uaHash(
            request.headers['user-agent'] as string | undefined,
          ),
          ip: clientIp(request),
        },
      });

      const token = await reply.jwtSign(
        { role: user.role, name: user.name, sid: session.id },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      );

      const refreshToken = await reply.jwtSign(
        { role: user.role, sid: session.id, typ: 'refresh' },
        {
          sign: {
            sub: user.id,
            expiresIn: '30d',
          },
        },
      );

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          //secure: true,
          sameSite: 'strict',
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
          // refreshToken,
          id,
          name,
          email,
          role,
        });
    }
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
