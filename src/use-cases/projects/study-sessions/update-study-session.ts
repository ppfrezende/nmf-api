import { type Prisma, type StudySession } from '@prisma/client';
import type { StudySessionRepository } from '@/repositories/study-sessions-repository';

interface UpdateStudySessionUseCaseRequest {
  studySessionId: string;
  data: Prisma.StudySessionUpdateInput;
}

interface UpdateStudySessionUseCaseResponse {
  updatedStudySession: StudySession | null;
}

export class UpdateStudySessionUseCase {
  constructor(private repository: StudySessionRepository) {}

  async execute({
    studySessionId,
    data,
  }: UpdateStudySessionUseCaseRequest): Promise<UpdateStudySessionUseCaseResponse> {
    const updatedStudySession = await this.repository.update(
      studySessionId,
      data,
    );

    return {
      updatedStudySession,
    };
  }
}
