import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects-repository';
import { GetProjectsByUserUseCase } from '@/use-cases/projects/get-project-by-user';

export function makeGetProjectsByUserUseCase() {
  const repository = new PrismaProjectsRepository();
  const useCase = new GetProjectsByUserUseCase(repository);

  return useCase;
}
