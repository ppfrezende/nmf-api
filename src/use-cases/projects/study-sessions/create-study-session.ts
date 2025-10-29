import { type StudySession } from '@prisma/client';
import type { StudySessionRepository } from '@/repositories/study-sessions-repository';

interface CreateStudySessionUseCaseRequest {
  scanningReadingDurationSec?: number | null;
  skimmingReadingDurationSec?: number | null;
  pagesReaded?: number | null;
  theoryStatus?: boolean;

  rightQuestions?: number | null;
  wrongQuestions?: number | null;
  performancePercentage?: number | null;
  questionsDurationSec?: number | null;
  questionStatus?: boolean;

  totalStudingDurationSec?: number | null;
  notes?: string | null;
  viewAt?: Date | null;

  studyMethod?: string | null;

  cycleId: string;
  topicId: string;
  projectId: string;
}

interface CreateStudySessionUseCaseResponse {
  study_session: StudySession;
}

export class CreateStudySessionUseCase {
  constructor(private repository: StudySessionRepository) {}

  async execute({
    scanningReadingDurationSec,
    skimmingReadingDurationSec,

    pagesReaded,
    theoryStatus,

    rightQuestions,
    wrongQuestions,
    performancePercentage,
    questionsDurationSec,
    questionStatus,

    totalStudingDurationSec,

    notes,
    viewAt,

    studyMethod,

    cycleId,
    topicId,
    projectId,
  }: CreateStudySessionUseCaseRequest): Promise<CreateStudySessionUseCaseResponse> {
    const study_session = await this.repository.create(
      {
        scanningReadingDurationSec,
        skimmingReadingDurationSec,
        pagesReaded,
        theoryStatus,

        rightQuestions,
        wrongQuestions,
        performancePercentage,
        questionsDurationSec,
        questionStatus,

        totalStudingDurationSec,

        notes,
        viewAt,

        studyMethod,
      },
      cycleId,
      topicId,
      projectId,
    );

    return {
      study_session,
    };
  }
}
