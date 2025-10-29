import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeCreateTopicUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/topics/make-create-topic-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createTopics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTopicsQuerySchema = z.object({
    projectId: z.string(),
    disciplineId: z.string(),
  });
  const createTopicsBodySchema = z.object({
    topics: z
      .array(
        z.object({
          title: z.string(),
        }),
      )
      .nonempty('Precisa de pelo menos 1 tópico'),
  });
  const { projectId, disciplineId } = createTopicsQuerySchema.parse(
    request.params,
  );
  const { topics } = createTopicsBodySchema.parse(request.body);

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

    const createTopicUseCase = makeCreateTopicUseCase();

    await createTopicUseCase.execute({
      topics,
      projectId,
      disciplineId,
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
