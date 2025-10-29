import type { StudySessionRepository } from '@/repositories/study-sessions-repository';

interface DeleteStudySessionUseCaseRequest {
  studySessionId: string;
}

export class DeleteStudySessionUseCase {
  constructor(private repository: StudySessionRepository) {}

  async execute({
    studySessionId,
  }: DeleteStudySessionUseCaseRequest): Promise<void> {
    await this.repository.deleteForever(studySessionId);

    return;
  }
}
