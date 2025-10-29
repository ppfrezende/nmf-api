import { PrismaStudySessionsRepository } from '@/repositories/prisma/prisma-study-sessions-repository';
import { UpdateStudySessionUseCase } from '@/use-cases/projects/study-sessions/update-study-session';

export function makeUpdateStudySessionUseCase() {
  const repository = new PrismaStudySessionsRepository();
  const useCase = new UpdateStudySessionUseCase(repository);

  return useCase;
}
