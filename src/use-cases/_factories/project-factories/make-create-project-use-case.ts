import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects-repository';
import { CreateProjectUseCase } from '@/use-cases/projects/create-project';

export function makeCreateProjectUseCase() {
  const repository = new PrismaProjectsRepository();
  const useCase = new CreateProjectUseCase(repository);

  return useCase;
}
