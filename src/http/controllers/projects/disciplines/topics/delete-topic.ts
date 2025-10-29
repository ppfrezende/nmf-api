import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeDeleteTopicUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/topics/make-delete-topic-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function deleteTopic(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteTopicQuerySchema = z.object({
    topicId: z.string(),
    projectId: z.string(),
  });

  const { topicId, projectId } = deleteTopicQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();
    const deleteTopicUseCase = makeDeleteTopicUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    await deleteTopicUseCase.execute({
      topicId,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
