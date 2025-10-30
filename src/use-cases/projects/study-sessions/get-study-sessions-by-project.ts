import type { StudySessionRepository } from '@/repositories/study-sessions-repository';
import { type StudySession } from '@prisma/client';

interface GetStudySessionsByProjectUseCaseRequest {
  projectId: string;
}

interface GetStudySessionsByProjectUseCaseResponse {
  total_count: number;
  study_sessions: StudySession[];
}

export class GetStudySessionsByProjectUseCase {
  constructor(private repository: StudySessionRepository) {}

  async execute({
    projectId,
  }: GetStudySessionsByProjectUseCaseRequest): Promise<GetStudySessionsByProjectUseCaseResponse> {
    const { study_sessions, total_count } =
      await this.repository.listAllStudySessions(projectId);

    return {
      study_sessions,
      total_count,
    };
  }
}
