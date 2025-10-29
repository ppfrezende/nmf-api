import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetStudiedTopicsByCycleUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/topics/make-get-studied-topics-by-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getStudiedTopicsByCycle(
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

    const getStudiedTopicsByCycleUseCase = makeGetStudiedTopicsByCycleUseCase();

    const { studiedTopics, unstudiedTopics } =
      await getStudiedTopicsByCycleUseCase.execute({
        projectId,
        cycleId,
      });
    return reply.status(201).send({ studiedTopics, unstudiedTopics });
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
