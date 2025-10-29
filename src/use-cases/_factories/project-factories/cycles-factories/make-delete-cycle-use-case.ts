import { PrismaCyclesRepository } from '@/repositories/prisma/prisma-cycles-repository';
import { DeleteCycleUseCase } from '@/use-cases/projects/cycles/delete-cycle';

export function makeDeleteCycleUseCase() {
  const repository = new PrismaCyclesRepository();
  const useCase = new DeleteCycleUseCase(repository);

  return useCase;
}
