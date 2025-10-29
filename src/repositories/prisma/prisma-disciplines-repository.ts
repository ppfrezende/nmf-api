import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { DisciplinesRepository } from '../disciplines-repository';

export class PrismaDisciplinesRepository implements DisciplinesRepository {
  async findById(id: string, projectId: string) {
    const discipline = await prisma.discipline.findFirst({
      where: {
        id,
        projectId,
      },
      include: {
        topics: true,
      },
    });

    return discipline;
  }

  async create(
    disciplines: Prisma.DisciplineCreateManyInput[],
    projectId: string,
  ) {
    // pega o último position já existente no projeto
    const last = await prisma.discipline.findFirst({
      where: { projectId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const lastPosition = last ? last.position : -1;

    const now = new Date();
    const createdAtUTC = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds(),
      ),
    );

    // gera os dados com position incremental
    const dataToCreate = disciplines.map((d, index) => ({
      ...d,
      projectId,
      createdAt: createdAtUTC,
      position: lastPosition + index + 1, // 👈 incrementa a partir do último
    }));

    const result = await prisma.discipline.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    return result; // BatchPayload { count }
  }

  async update(id: string, data: Prisma.DisciplineUpdateInput) {
    const discipline = await prisma.discipline.update({
      where: {
        id,
      },
      data,
    });

    return discipline;
  }

  async deleteForever(id: string) {
    await prisma.discipline.delete({
      where: {
        id,
      },
    });

    return;
  }

  async getDisciplinesStatsByCycle(projectId: string, cycleId: string) {
    const disciplines = await prisma.discipline.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        topics: {
          select: {
            id: true,
            study_sessions: {
              where: { cycleId },
              select: {
                pagesReaded: true,
                rightQuestions: true,
                wrongQuestions: true,
                performancePercentage: true,
                skimmingReadingDurationSec: true,
                scanningReadingDurationSec: true,
                totalStudingDurationSec: true,
                questionsDurationSec: true,
              },
            },
          },
        },
      },
      orderBy: [{ position: 'asc' }],
    });

    return disciplines.map((discipline) => {
      let pagesReaded = 0,
        rightQuestions = 0,
        wrongQuestions = 0,
        performancePercentage: Prisma.Decimal | null = new Prisma.Decimal(0),
        skimmingReadingDurationSec = 0,
        scanningReadingDurationSec = 0,
        questionsDurationSec = 0;

      for (const topic of discipline.topics) {
        for (const study_session of topic.study_sessions) {
          pagesReaded += study_session.pagesReaded ?? 0;
          rightQuestions += study_session.rightQuestions ?? 0;
          wrongQuestions += study_session.wrongQuestions ?? 0;
          performancePercentage = study_session.performancePercentage;
          skimmingReadingDurationSec +=
            study_session.skimmingReadingDurationSec ?? 0;
          scanningReadingDurationSec +=
            study_session.scanningReadingDurationSec ?? 0;
          questionsDurationSec += study_session.questionsDurationSec ?? 0;
        }
      }

      const avarageSecondsPerPage = Math.round(
        scanningReadingDurationSec / pagesReaded,
      );
      const avarageSecondsPerQuestion = Math.round(
        questionsDurationSec / (rightQuestions + wrongQuestions),
      );

      return {
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        topicsCount: discipline.topics.length,
        pagesReaded,
        rightQuestions,
        wrongQuestions,
        skimmingReadingDurationSec,
        scanningReadingDurationSec,
        questionsDurationSec,
        performancePercentage,
        avarageSecondsPerPage,
        avarageSecondsPerQuestion,
      };
    });
  }

  async getTotalDisciplinesStats(projectId: string) {
    const disciplines = await prisma.discipline.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        notes: true,
        topics: {
          select: {
            id: true,
            title: true,
            notes: true,
            study_sessions: {
              select: {
                pagesReaded: true,
                rightQuestions: true,
                wrongQuestions: true,
                performancePercentage: true,
                skimmingReadingDurationSec: true,
                scanningReadingDurationSec: true,
                totalStudingDurationSec: true,
                questionsDurationSec: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ position: 'asc' }],
    });

    return disciplines.map((discipline) => {
      let pagesReaded = 0,
        rightQuestions = 0,
        wrongQuestions = 0,
        skimmingReadingDurationSec = 0,
        scanningReadingDurationSec = 0,
        questionsDurationSec = 0;

      for (const topic of discipline.topics) {
        for (const study_session of topic.study_sessions) {
          pagesReaded += study_session.pagesReaded ?? 0;
          rightQuestions += study_session.rightQuestions ?? 0;
          wrongQuestions += study_session.wrongQuestions ?? 0;

          skimmingReadingDurationSec +=
            study_session.skimmingReadingDurationSec ?? 0;
          scanningReadingDurationSec +=
            study_session.scanningReadingDurationSec ?? 0;
          questionsDurationSec += study_session.questionsDurationSec ?? 0;
        }
      }

      const avarageSecondsPerPage = Math.round(
        scanningReadingDurationSec / pagesReaded,
      );
      const avarageSecondsPerQuestion = Math.round(
        questionsDurationSec / (rightQuestions + wrongQuestions),
      );

      const performancePercentage = Math.round(
        (rightQuestions / (rightQuestions + wrongQuestions)) * 100,
      );

      return {
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        disciplineNotes: discipline.notes,
        topics: discipline.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          notes: topic.notes,
        })),
        topicsCount: discipline.topics.length,
        pagesReaded,
        rightQuestions,
        wrongQuestions,
        skimmingReadingDurationSec,
        scanningReadingDurationSec,
        questionsDurationSec,
        performancePercentage,
        avarageSecondsPerPage,
        avarageSecondsPerQuestion,
      };
    });
  }
}
