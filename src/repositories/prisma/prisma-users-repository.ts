import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async searchMany(query: string, page: number) {
    const users = await prisma.user.findMany({
      where: {
        isActive: false,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: 50,
      skip: (page - 1) * 50,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async listMany(page: number) {
    const users = await prisma.user.findMany({
      take: 50,
      skip: (page - 1) * 50,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async listAll() {
    const users = await prisma.user.findMany({
      where: {
        isActive: false,
      },
    });

    return users;
  }

  async listAllTrash() {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
    });

    return users;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
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
      createdAt: createdAtUTC,
    };
    const user = await prisma.user.create({
      data: dataToCreate,
    });

    return user;
  }

  async delete(id: string, toggleActiveAndUnactiveBy: string) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
        toggleActiveAndUnactiveBy,
        unactiveAt: new Date(),
      },
    });

    return;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return user;
  }
}
