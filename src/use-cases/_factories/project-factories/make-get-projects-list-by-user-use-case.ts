import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects-repository';
import { GetProjectsListByUserUseCase } from '@/use-cases/projects/get-projects-list-by-user';

export function makeGetProjectsListByUserUseCase() {
  const repository = new PrismaProjectsRepository();
  const useCase = new GetProjectsListByUserUseCase(repository);

  return useCase;
}
