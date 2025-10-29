import { PrismaTopicsRepository } from '@/repositories/prisma/prisma-topic-repository';
import { CreateTopicUseCase } from '@/use-cases/projects/disciplines/topics/create-topic';

export function makeCreateTopicUseCase() {
  const repository = new PrismaTopicsRepository();
  const useCase = new CreateTopicUseCase(repository);

  return useCase;
}
