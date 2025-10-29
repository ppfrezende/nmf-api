import { type StudySession } from '@prisma/client';
import type { StudySessionRepository } from '@/repositories/study-sessions-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';

interface GetStudySessionUseCaseRequest {
  studySessionId: string;
}

interface GetStudySessionUseCaseResponse {
  studySession: StudySession | null;
}

export class GetStudySessionUseCase {
  constructor(private repository: StudySessionRepository) {}

  async execute({
    studySessionId,
  }: GetStudySessionUseCaseRequest): Promise<GetStudySessionUseCaseResponse> {
    const studySession = await this.repository.findById(studySessionId);

    if (!studySession) {
      throw new ResourceNotFoundError();
    }

    return { studySession };
  }
}
