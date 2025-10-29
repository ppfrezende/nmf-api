import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetStudySessionUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-get-study-session-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { Prisma } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getStudySession(
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

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    const getStudySessionUseCase = makeGetStudySessionUseCase();

    const { studySession } = await getStudySessionUseCase.execute({
      studySessionId,
    });

    return reply.status(201).send(studySession);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return reply.code(409).send({
        message: `Unique constraints ${err.meta?.target}`,
        code: 'DUPLICATED_SESSION',
      });
    }

    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
