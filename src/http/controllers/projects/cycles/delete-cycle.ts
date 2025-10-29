import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeDeleteCycleUseCase } from '@/use-cases/_factories/project-factories/cycles-factories/make-delete-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function deleteCycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCycleQuerySchema = z.object({
    projectId: z.string(),
    cycleId: z.string(),
  });

  const { projectId, cycleId } = deleteCycleQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();
    const deleteCycleUseCase = makeDeleteCycleUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    await deleteCycleUseCase.execute({
      cycleId,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
