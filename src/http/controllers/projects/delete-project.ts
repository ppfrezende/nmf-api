import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeDeleteUserProjectUseCase } from '@/use-cases/_factories/project-factories/make-delete-project-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function deleteUserProject(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteUserProjectQuerySchema = z.object({
    projectId: z.string(),
  });

  const { projectId } = deleteUserProjectQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();
    const deleteUserProjectUseCase = makeDeleteUserProjectUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    await deleteUserProjectUseCase.execute({
      projectId,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
