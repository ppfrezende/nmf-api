import { PrismaTopicsRepository } from '@/repositories/prisma/prisma-topic-repository';
import { DeleteTopicUseCase } from '@/use-cases/projects/disciplines/topics/delete-topic';

export function makeDeleteTopicUseCase() {
  const repository = new PrismaTopicsRepository();
  const useCase = new DeleteTopicUseCase(repository);

  return useCase;
}
