import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetCycleUseCase } from '@/use-cases/_factories/project-factories/cycles-factories/make-get-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getCycle(request: FastifyRequest, reply: FastifyReply) {
  const getCycleQuerySchema = z.object({
    cycleId: z.string(),
    projectId: z.string(),
  });

  const { cycleId, projectId } = getCycleQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();
    const getCycleUseCase = makeGetCycleUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    const { cycle } = await getCycleUseCase.execute({
      cycleId,
      projectId,
    });

    return reply
      .status(200)

      .send(cycle);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
