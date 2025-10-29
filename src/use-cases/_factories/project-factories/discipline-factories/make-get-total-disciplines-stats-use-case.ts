import { PrismaDisciplinesRepository } from '@/repositories/prisma/prisma-disciplines-repository';
import { GetTotalDisciplinesStatsUseCase } from '@/use-cases/projects/disciplines/get-total-disciplines-stats';

export function makeGetTotalDisciplinesStatsUseCase() {
  const repository = new PrismaDisciplinesRepository();
  const useCase = new GetTotalDisciplinesStatsUseCase(repository);

  return useCase;
}
