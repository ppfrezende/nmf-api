import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetUsersListUseCase } from '@/use-cases/_factories/users-factories/make-get-users-list-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getUsersList(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUsersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = getUsersQuerySchema.parse(request.query);

  try {
    const getUsersUseCase = makeGetUsersListUseCase();

    const { users, numberOfRegisters, totalCount } =
      await getUsersUseCase.execute({
        page,
      });

    return reply
      .status(200)
      .headers({
        'x-total-count': totalCount,
        'x-page-count': numberOfRegisters,
      })

      .send({ users });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
