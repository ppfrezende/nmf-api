import { PrismaCyclesRepository } from '@/repositories/prisma/prisma-cycles-repository';
import { CreateCycleUseCase } from '@/use-cases/projects/cycles/create-cycle';

export function makeCreateCycleUseCase() {
  const repository = new PrismaCyclesRepository();
  const useCase = new CreateCycleUseCase(repository);

  return useCase;
}
