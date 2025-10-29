import { PrismaDisciplinesRepository } from '@/repositories/prisma/prisma-disciplines-repository';
import { UpdateDisciplineUseCase } from '@/use-cases/projects/disciplines/update-discipline';

export function makeUpdateDisciplineUseCase() {
  const repository = new PrismaDisciplinesRepository();
  const useCase = new UpdateDisciplineUseCase(repository);

  return useCase;
}
