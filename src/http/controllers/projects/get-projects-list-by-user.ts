import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetProjectsListByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-projects-list-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getProjectsListByUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProjectsListByUserQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = getProjectsListByUserQuerySchema.parse(request.query);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsListByUserUseCase = makeGetProjectsListByUserUseCase();

    const { projects, registersPerPage, total_count } =
      await getProjectsListByUserUseCase.execute({
        page,
        userId: user.id,
      });

    return reply
      .status(200)
      .headers({
        'x-total-count': total_count,
        'x-page-count': registersPerPage,
      })

      .send({ projects });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
