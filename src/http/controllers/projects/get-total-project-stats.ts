import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetTotalDisciplinesStatsUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/make-get-total-disciplines-stats-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function getTotalProjectStats(
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

    const getTotalDisciplinesStatsUseCase =
      makeGetTotalDisciplinesStatsUseCase();

    const { disciplines } = await getTotalDisciplinesStatsUseCase.execute({
      projectId,
    });

    const result = disciplines.reduce(
      (accumulator, discipline) => {
        accumulator.topicsCount += discipline.topicsCount;
        accumulator.pagesReaded += discipline.pagesReaded;
        accumulator.rightQuestions += discipline.rightQuestions;
        accumulator.wrongQuestions += discipline.wrongQuestions;
        return accumulator;
      },
      {
        topicsCount: 0,
        pagesReaded: 0,
        rightQuestions: 0,
        wrongQuestions: 0,
        performancePercentage: 0,
      },
    );

    result.performancePercentage =
      (result.rightQuestions /
        (result.rightQuestions + result.wrongQuestions)) *
      100;

    return reply.status(201).send(result);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
