import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetDisciplinesStatsByCycleUseCase } from '@/use-cases/_factories/project-factories/cycles-factories/make-get-disciplines-stats-by-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getDisciplinesStatsByCycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    projectId: z.string(),
    cycleId: z.string(),
  });

  const { projectId, cycleId } = querySchema.parse(request.params);

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

    const getDisciplinesStatsByCycleUseCase =
      makeGetDisciplinesStatsByCycleUseCase();

    const { disciplines } = await getDisciplinesStatsByCycleUseCase.execute({
      projectId,
      cycleId,
    });

    return reply.status(201).send(disciplines);
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
