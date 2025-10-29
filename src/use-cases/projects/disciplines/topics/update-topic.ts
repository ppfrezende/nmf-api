import type { TopicsRepository } from '@/repositories/topics-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { Prisma, type Topic } from '@prisma/client';

interface UpdateTopicUseCaseRequest {
  disciplineId: string;
  topicId: string;
  data: Prisma.TopicUpdateInput;
}

interface UpdateTopicUseCaseResponse {
  updatedTopic: Topic | null;
}

export class UpdateTopicUseCase {
  constructor(private repository: TopicsRepository) {}

  async execute({
    disciplineId,
    topicId,
    data,
  }: UpdateTopicUseCaseRequest): Promise<UpdateTopicUseCaseResponse> {
    const topic = await this.repository.findById(topicId, disciplineId);

    if (!topic) {
      throw new ResourceNotFoundError();
    }

    const updatedTopic = await this.repository.update(topicId, data);

    return {
      updatedTopic,
    };
  }
}
