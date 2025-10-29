import { PrismaProjectsRepository } from '@/repositories/prisma/prisma-projects-repository';
import { DeleteUserProjectUseCase } from '@/use-cases/projects/delete-project';

export function makeDeleteUserProjectUseCase() {
  const repository = new PrismaProjectsRepository();
  const useCase = new DeleteUserProjectUseCase(repository);

  return useCase;
}
