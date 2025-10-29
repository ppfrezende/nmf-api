import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getProjectByUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProjectsByUserQuerySchema = z.object({
    projectId: z.string(),
  });

  const { projectId } = getProjectsByUserQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();

    const { project } = await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    return reply
      .status(200)

      .send({ project });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
