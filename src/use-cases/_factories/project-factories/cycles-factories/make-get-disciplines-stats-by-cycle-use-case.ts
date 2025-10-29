import { PrismaDisciplinesRepository } from '@/repositories/prisma/prisma-disciplines-repository';
import { GetDisciplinesStatsByCycleUseCase } from '@/use-cases/projects/cycles/get-disciplines-stats-by-cycle';

export function makeGetDisciplinesStatsByCycleUseCase() {
  const repository = new PrismaDisciplinesRepository();
  const useCase = new GetDisciplinesStatsByCycleUseCase(repository);

  return useCase;
}
