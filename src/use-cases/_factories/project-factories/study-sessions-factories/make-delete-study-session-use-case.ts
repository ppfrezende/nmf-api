import { PrismaStudySessionsRepository } from '@/repositories/prisma/prisma-study-sessions-repository';
import { DeleteStudySessionUseCase } from '@/use-cases/projects/study-sessions/delete-study-session';

export function makeDeleteStudySessionUseCase() {
  const repository = new PrismaStudySessionsRepository();
  const useCase = new DeleteStudySessionUseCase(repository);

  return useCase;
}
