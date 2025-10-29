import { PrismaStudySessionsRepository } from '@/repositories/prisma/prisma-study-sessions-repository';
import { GetStudySessionUseCase } from '@/use-cases/projects/study-sessions/get-study-session';

export function makeGetStudySessionUseCase() {
  const repository = new PrismaStudySessionsRepository();
  const useCase = new GetStudySessionUseCase(repository);

  return useCase;
}
