import { PrismaTopicsRepository } from '@/repositories/prisma/prisma-topic-repository';
import { GetStudiedTopicsByCycleUseCase } from '@/use-cases/projects/disciplines/topics/get-studied-topics-by-cycle';

export function makeGetStudiedTopicsByCycleUseCase() {
  const repository = new PrismaTopicsRepository();
  const useCase = new GetStudiedTopicsByCycleUseCase(repository);

  return useCase;
}
