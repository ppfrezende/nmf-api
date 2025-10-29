import { PrismaDisciplinesRepository } from '@/repositories/prisma/prisma-disciplines-repository';
import { DeleteDisciplineUseCase } from '@/use-cases/projects/disciplines/delete-discipline';

export function makeDeleteDisciplineUseCase() {
  const repository = new PrismaDisciplinesRepository();
  const useCase = new DeleteDisciplineUseCase(repository);

  return useCase;
}
