import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetStudySessionsByProjectUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-get-study-sessions-by-project-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getStudySessionsByProject(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    projectId: z.string(),
  });

  const { projectId } = querySchema.parse(request.params);

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

    const getStudySessionsByProjectUseCase =
      makeGetStudySessionsByProjectUseCase();

    const { study_sessions, total_count } =
      await getStudySessionsByProjectUseCase.execute({
        projectId,
      });
    return reply
      .status(201)
      .headers({
        'x-total-count': total_count,
      })
      .send({ study_sessions });
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
