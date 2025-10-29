import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { CyclesRepository } from '../cycles-repository';

export class PrismaCyclesRepository implements CyclesRepository {
  async findById(id: string, projectId: string) {
    const cycle = await prisma.cycle.findFirst({
      where: {
        id,
        projectId,
      },
      include: {
        study_sessions: true,
      },
    });

    return cycle;
  }

  async create(data: Prisma.CycleCreateInput, projectId: string) {
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
      project: { connect: { id: projectId } },
      createdAt: createdAtUTC,
    };
    const cycle = await prisma.cycle.create({
      data: dataToCreate,
    });

    return cycle;
  }

  async update(id: string, data: Prisma.CycleUpdateInput) {
    const cycle = await prisma.cycle.update({
      where: {
        id,
      },
      data,
    });

    return cycle;
  }

  async deleteForever(id: string) {
    await prisma.cycle.delete({
      where: {
        id,
      },
    });

    return;
  }

  // async getResumeOfStudy(projectId: string, cycleId: string) {
  //   const topics = await prisma.topic.findMany({
  //     where: { projectId },
  //     include: {
  //       study_sessions: {
  //         where: { cycleId }, // filtra só as sessões do ciclo
  //         select: { id: true }, // traz mínimo
  //         take: 1, // basta saber se existe
  //       },
  //     },
  //     orderBy: { position: 'asc' },
  //   });

  //   const withSessions = topics.filter((t) => t.study_sessions.length > 0);
  //   const withoutSessions = topics.filter((t) => t.study_sessions.length === 0);
  //   return {
  //     withSessions,
  //     withoutSessions,
  //   };
  // }
}
