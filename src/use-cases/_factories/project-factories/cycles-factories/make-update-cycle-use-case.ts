import { PrismaCyclesRepository } from '@/repositories/prisma/prisma-cycles-repository';
import { UpdateCycleUseCase } from '@/use-cases/projects/cycles/update-cycle';

export function makeUpdateCycleUseCase() {
  const repository = new PrismaCyclesRepository();
  const useCase = new UpdateCycleUseCase(repository);

  return useCase;
}
