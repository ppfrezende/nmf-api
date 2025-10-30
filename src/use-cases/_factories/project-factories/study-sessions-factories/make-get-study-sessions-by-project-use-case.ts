import { PrismaStudySessionsRepository } from '@/repositories/prisma/prisma-study-sessions-repository';
import { GetStudySessionsByProjectUseCase } from '@/use-cases/projects/study-sessions/get-study-sessions-by-project';

export function makeGetStudySessionsByProjectUseCase() {
  const repository = new PrismaStudySessionsRepository();
  const useCase = new GetStudySessionsByProjectUseCase(repository);

  return useCase;
}
