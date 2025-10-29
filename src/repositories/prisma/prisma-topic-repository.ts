import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { TopicsRepository } from '../topics-repository';

export class PrismaTopicsRepository implements TopicsRepository {
  async findById(id: string, disciplineId: string) {
    const topic = await prisma.topic.findFirst({
      where: {
        id,
        disciplineId,
      },
    });

    return topic;
  }

  async create(
    topics: Prisma.TopicCreateManyInput[],
    projectId: string,
    disciplineId: string,
  ) {
    const last = await prisma.topic.findFirst({
      where: { disciplineId },
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
    const dataToCreate = topics.map((d, index) => ({
      ...d,
      disciplineId,
      projectId,
      createdAt: createdAtUTC,
      position: lastPosition + index + 1, // 👈 incrementa a partir do último
    }));

    const result = await prisma.topic.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    return result; // BatchPayload { count }
  }

  async update(id: string, data: Prisma.TopicUpdateInput) {
    const topic = await prisma.topic.update({
      where: {
        id,
      },
      data,
    });

    return topic;
  }

  async studiedTopicsByCycle(projectId: string, cycleId: string) {
    const topics = await prisma.topic.findMany({
      where: { projectId },
      include: {
        discipline: {
          select: {
            name: true,
          },
        },
        study_sessions: {
          where: { cycleId }, // filtra só as sessões do ciclo
          select: {
            id: true,
            scanningReadingDurationSec: true,
            skimmingReadingDurationSec: true,
            pagesReaded: true,
            theoryStatus: true,
            rightQuestions: true,
            wrongQuestions: true,
            performancePercentage: true,
            questionsDurationSec: true,
            totalStudingDurationSec: true,
            questionStatus: true,
            notes: true,
            viewAt: true,
            studyMethod: true,
          },
          take: 1,
        },
      },
      orderBy: { title: 'asc' },
    });

    const studiedTopics = topics.filter((t) => t.study_sessions.length > 0);
    const unstudiedTopics = topics.filter((t) => t.study_sessions.length === 0);

    return { studiedTopics, unstudiedTopics };
  }

  async deleteForever(topicId: string) {
    await prisma.topic.delete({
      where: {
        id: topicId,
      },
    });

    return;
  }
}
