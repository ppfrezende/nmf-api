import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects-repository';
import { UpdateProjectUseCase } from '@/use-cases/projects/update-project';

export function makeUpdateProjectUseCase() {
  const repository = new PrismaProjectsRepository();
  const useCase = new UpdateProjectUseCase(repository);

  return useCase;
}
