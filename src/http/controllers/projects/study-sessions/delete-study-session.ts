import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeDeleteStudySessionUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-delete-study-session-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function deleteStudySession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    projectId: z.string(),
    studySessionId: z.string(),
  });

  const { projectId, studySessionId } = querySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();
    const deleteStudySessionUseCase = makeDeleteStudySessionUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    await deleteStudySessionUseCase.execute({
      studySessionId,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
