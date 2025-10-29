import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { ProjectsRepository } from '../projects-repository';

export class PrismaProjectsRepository implements ProjectsRepository {
  async findById(id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        cycles: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        disciplines: {
          orderBy: {
            position: 'asc',
          },
          include: {
            topics: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });

    return project;
  }

  async listMany(page: number, userId: string) {
    const where = { userId, isDeleted: false };

    const [projects, total_count] = await Promise.all([
      prisma.project.findMany({
        where,
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total_count };
  }

  // async listAllTrash(page: number) {
  //   const projects = await prisma.project.findMany({
  //     where: {
  //       isDeleted: true,
  //     },
  //     take: 10,
  //     skip: (page - 1) * 10,
  //     orderBy: {
  //       deletedAt: 'desc',
  //     },
  //   });

  //   return projects;
  // }

  // async searchMany(query: string, page: number) {
  //   const projects = await prisma.project.findMany({
  //     where: {
  //       OR: [
  //         {
  //           title: {
  //             contains: query,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           board: {
  //             contains: query,
  //             mode: 'insensitive',
  //           },
  //         },
  //       ],
  //     },
  //     take: 10,
  //     skip: (page - 1) * 10,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });

  //   return projects;
  // }

  async create(data: Prisma.ProjectCreateInput, userId: string) {
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
    ).toISOString();

    const dataToCreate = {
      ...data,
      user: { connect: { id: userId } },
      createdAt: createdAtUTC,
    };
    const project = await prisma.project.create({
      data: dataToCreate,
    });

    return project;
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await prisma.project.update({
      where: {
        id,
      },
      data,
    });

    return project;
  }

  async deleteForever(projectId: string) {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return;
  }
}
