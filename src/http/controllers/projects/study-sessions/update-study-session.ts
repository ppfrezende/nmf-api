import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetStudySessionUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-get-study-session-use-case';
import { makeUpdateStudySessionUseCase } from '@/use-cases/_factories/project-factories/study-sessions-factories/make-update-study-session-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import {
  computeQuestionsPerformance,
  computeStudingTime,
} from '@/utils/compute-performance';
import { Prisma } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateStudySession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
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
    theoryStatus: z.boolean().optional(),

    rightQuestions: z.number().int().nonnegative().nullable().optional(),
    wrongQuestions: z.number().int().nonnegative().nullable().optional(),
    questionsDurationSec: z.number().int().nonnegative().nullable().optional(),
    questionStatus: z.boolean().optional(),

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
  });
  const querySchema = z.object({
    projectId: z.string(),
    studySessionId: z.string(),
  });

  const { projectId, studySessionId } = querySchema.parse(request.params);

  const body = bodySchema.parse(request.body);

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
    const updateStudySessionUseCase = makeUpdateStudySessionUseCase();

    const { studySession: currentStudySession } =
      await getStudySessionUseCase.execute({
        studySessionId,
      });

    const has = (k: keyof typeof body) =>
      Object.prototype.hasOwnProperty.call(body, k);

    let performancePercentage: number | null | undefined = undefined;
    let totalStudingDurationSec: number | null | undefined = undefined;

    const shouldUpdatePerformance = ['rightQuestions', 'wrongQuestions'].some(
      (key) => Object.prototype.hasOwnProperty.call(body, key),
    );

    const shouldUpdateTotal =
      has('scanningReadingDurationSec') ||
      has('skimmingReadingDurationSec') ||
      has('questionsDurationSec');

    if (currentStudySession) {
      if (shouldUpdatePerformance) {
        const nextRightQuestions = has('rightQuestions')
          ? body.rightQuestions
          : currentStudySession.rightQuestions;
        const nextWrongQuestions = has('wrongQuestions')
          ? body.wrongQuestions
          : currentStudySession.wrongQuestions;

        if (nextRightQuestions == null || nextWrongQuestions == null) {
          performancePercentage = null;
        } else {
          performancePercentage = computeQuestionsPerformance(
            nextRightQuestions,
            nextWrongQuestions,
          );
        }
      }

      if (shouldUpdateTotal) {
        const nextScanning = has('scanningReadingDurationSec')
          ? body.scanningReadingDurationSec
          : currentStudySession.scanningReadingDurationSec;

        const nextSkimming = has('skimmingReadingDurationSec')
          ? body.skimmingReadingDurationSec
          : currentStudySession.skimmingReadingDurationSec;

        const nextQuestionsDur = has('questionsDurationSec')
          ? body.questionsDurationSec
          : currentStudySession.questionsDurationSec;

        if (
          nextScanning === null &&
          nextSkimming === null &&
          nextQuestionsDur === null
        ) {
          totalStudingDurationSec = null;
        } else {
          totalStudingDurationSec = computeStudingTime(
            typeof nextScanning === 'number' ? nextScanning : 0,
            typeof nextSkimming === 'number' ? nextSkimming : 0,
            typeof nextQuestionsDur === 'number' ? nextQuestionsDur : 0,
          );
        }
      }
    }

    const updatePayload: Prisma.StudySessionUpdateInput = {
      ...body, // Prisma ignora undefined; null zera explicitamente
      ...(typeof performancePercentage !== 'undefined' && {
        performancePercentage,
      }),
      ...(typeof totalStudingDurationSec !== 'undefined' && {
        totalStudingDurationSec,
      }),
    };

    const study_session = await updateStudySessionUseCase.execute({
      studySessionId,
      data: updatePayload,
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
