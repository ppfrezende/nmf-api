import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeDeleteDisciplineUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/make-delete-discipline-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function deleteDiscipline(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteDisciplinesQuerySchema = z.object({
    disciplineId: z.string(),
    projectId: z.string(),
  });

  const { projectId, disciplineId } = deleteDisciplinesQuerySchema.parse(
    request.params,
  );

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    const deleteDisciplineUseCase = makeDeleteDisciplineUseCase();

    await deleteDisciplineUseCase.execute({
      disciplineId,
      projectId,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
