import { Prisma, type Topic } from '@prisma/client';

export interface TopicsRepository {
  findById(id: string, disciplineId: string): Promise<Topic | null>;
  create(
    data: Prisma.TopicCreateManyInput[],
    projectId: string,
    disciplineId: string,
  ): Promise<Prisma.BatchPayload>;
  update(id: string, data: Prisma.TopicUpdateInput): Promise<Topic | null>;
  studiedTopicsByCycle(
    projectId: string,
    cycleId: string,
  ): Promise<{
    studiedTopics: Topic[];
    unstudiedTopics: Topic[];
  }>;
  deleteForever(topicId: string): Promise<void | null>;
}
