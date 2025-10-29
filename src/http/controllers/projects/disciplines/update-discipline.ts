import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeUpdateDisciplineUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/make-update-discipline-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateDiscipline(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateDisciplineQuerySchema = z.object({
    disciplineId: z.string(),
    projectId: z.string(),
  });
  const updateDisciplineBodySchema = z.object({
    name: z.string(),
    notes: z.string().optional(),
  });
  const { disciplineId, projectId } = updateDisciplineQuerySchema.parse(
    request.params,
  );
  const { name, notes } = updateDisciplineBodySchema.parse(request.body);

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

    const updateDisciplineUseCase = makeUpdateDisciplineUseCase();

    await updateDisciplineUseCase.execute({
      disciplineId,
      projectId,
      data: {
        name,
        notes,
      },
    });

    return reply.status(201).send({ message: 'successfully updated' });
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
