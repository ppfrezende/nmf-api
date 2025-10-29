import { PrismaTopicsRepository } from '@/repositories/prisma/prisma-topic-repository';
import { UpdateTopicUseCase } from '@/use-cases/projects/disciplines/topics/update-topic';

export function makeUpdateTopicUseCase() {
  const repository = new PrismaTopicsRepository();
  const useCase = new UpdateTopicUseCase(repository);

  return useCase;
}
