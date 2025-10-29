import { PrismaDisciplinesRepository } from '@/repositories/prisma/prisma-disciplines-repository';
import { CreateDisciplineUseCase } from '@/use-cases/projects/disciplines/create-discipline';

export function makeCreateDisciplineUseCase() {
  const repository = new PrismaDisciplinesRepository();
  const useCase = new CreateDisciplineUseCase(repository);

  return useCase;
}
