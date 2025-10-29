import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { StudySessionRepository } from '../study-sessions-repository';

export class PrismaStudySessionsRepository implements StudySessionRepository {
  async findById(id: string) {
    const study_session = await prisma.studySession.findFirst({
      where: {
        id,
      },
      include: {
        topic: {
          select: {
            title: true,
            discipline: {
              select: { name: true },
            },
          },
        },
      },
    });

    return study_session;
  }

  async create(
    data: Prisma.StudySessionCreateInput,
    cycleId: string,
    topicId: string,
    projectId: string,
  ) {
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

    const dataToCreate = {
      ...data,
      cycle: { connect: { id: cycleId } },
      topic: { connect: { id: topicId } },
      project: { connect: { id: projectId } },
      createdAt: createdAtUTC,
    };
    const study_session = await prisma.studySession.create({
      data: dataToCreate,
    });

    return study_session;
  }

  async update(id: string, data: Prisma.StudySessionUpdateInput) {
    const study_session = await prisma.studySession.update({
      where: {
        id,
      },
      data,
    });

    return study_session;
  }

  async deleteForever(id: string) {
    await prisma.studySession.delete({
      where: {
        id,
      },
    });

    return;
  }
}
