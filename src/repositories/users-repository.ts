import { Prisma, User } from '@prisma/client';

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  searchMany(query: string, page: number): Promise<User[]>;
  listMany(page: number): Promise<User[]>;
  listAll(): Promise<User[]>;
  listAllTrash(): Promise<User[]>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  delete(id: string, deletedBy: string): Promise<void | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User | null>;
}
