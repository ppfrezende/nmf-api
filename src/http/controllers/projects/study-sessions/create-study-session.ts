import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeCreateStudySessionUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-create-study-session-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import {
  computeQuestionsPerformance,
  computeStudingTime,
} from '@/utils/compute-performance';
import { Prisma } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createStudySession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createStudySessionBodySchema = z.object({
    scanningReadingDurationSec: z
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional(),
    skimmingReadingDurationSec: z
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional(),
    pagesReaded: z.number().int().nonnegative().nullable().optional(),
    theoryStatus: z.boolean(),

    rightQuestions: z.number().int().nonnegative().nullable().optional(),
    wrongQuestions: z.number().int().nonnegative().nullable().optional(),
    questionsDurationSec: z.number().int().nonnegative().nullable().optional(),
    questionStatus: z.boolean(),

    notes: z.string().max(10_000).nullable().optional(),
    viewAt: z
      .preprocess(
        (v) =>
          typeof v === 'string' || typeof v === 'number' ? new Date(v) : v,
        z.date(),
      )
      .nullable()
      .optional(),

    studyMethod: z.string().min(1).nullable().optional(),
    topicId: z.string(),
  });
  const createStudySessionQuerySchema = z.object({
    cycleId: z.string(),
    projectId: z.string(),
  });

  const { cycleId, projectId } = createStudySessionQuerySchema.parse(
    request.params,
  );
  const {
    scanningReadingDurationSec,
    skimmingReadingDurationSec,
    pagesReaded,
    theoryStatus,

    rightQuestions,
    wrongQuestions,
    questionsDurationSec,
    questionStatus,

    notes,
    viewAt,

    studyMethod,

    topicId,
  } = createStudySessionBodySchema.parse(request.body);

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

    const createStudySessionUseCase = makeCreateStudySessionUseCase();

    const performancePct = computeQuestionsPerformance(
      rightQuestions,
      wrongQuestions,
    );

    const totalStuding = computeStudingTime(
      scanningReadingDurationSec,
      skimmingReadingDurationSec,
      questionsDurationSec,
    );

    const study_session = await createStudySessionUseCase.execute({
      scanningReadingDurationSec,
      skimmingReadingDurationSec,
      pagesReaded,
      theoryStatus,

      rightQuestions,
      wrongQuestions,
      performancePercentage: performancePct,
      questionsDurationSec,
      questionStatus,

      totalStudingDurationSec: totalStuding,

      notes,
      viewAt,

      studyMethod,
      cycleId,
      topicId,
      projectId,
    });

    return reply.status(201).send(study_session);
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
