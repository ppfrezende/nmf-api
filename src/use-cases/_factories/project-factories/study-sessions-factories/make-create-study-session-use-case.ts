import { PrismaStudySessionsRepository } from '@/repositories/prisma/prisma-study-sessions-repository';
import { CreateStudySessionUseCase } from '@/use-cases/projects/study-sessions/create-study-session';

export function makeCreateStudySessionUseCase() {
  const repository = new PrismaStudySessionsRepository();
  const useCase = new CreateStudySessionUseCase(repository);

  return useCase;
}
