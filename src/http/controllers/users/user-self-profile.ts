import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function userSelfProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserUseCase = makeGetUserUseCase();

  const { user } = await getUserUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
