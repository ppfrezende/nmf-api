import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUsersListUseCase } from '@/use-cases/users/get-users-list';

export function makeGetUsersListUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUsersListUseCase(usersRepository);

  return useCase;
}
