import { PrismaCyclesRepository } from '@/repositories/prisma/prisma-cycles-repository';
import { GetCycleUseCase } from '@/use-cases/projects/cycles/get-cycle';

export function makeGetCycleUseCase() {
  const repository = new PrismaCyclesRepository();
  const useCase = new GetCycleUseCase(repository);

  return useCase;
}
