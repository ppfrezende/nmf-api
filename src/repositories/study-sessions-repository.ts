import { Prisma, type StudySession } from '@prisma/client';

export interface StudySessionRepository {
  findById(studySessionId: string): Promise<StudySession | null>;
  listAllStudySessions(projectId: string): Promise<{
    study_sessions: StudySession[];
    total_count: number;
  }>;
  create(
    data: Prisma.StudySessionCreateInput,
    cycleId: string,
    topicId: string,
    projectId: string,
  ): Promise<StudySession>;
  update(
    id: string,
    data: Prisma.StudySessionUpdateInput,
  ): Promise<StudySession | null>;
  deleteForever(id: string): Promise<void | null>;
}
