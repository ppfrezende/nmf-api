import type { TopicsRepository } from '@/repositories/topics-repository';

interface DeleteTopicUseCaseRequest {
  topicId: string;
}

export class DeleteTopicUseCase {
  constructor(private repository: TopicsRepository) {}

  async execute({ topicId }: DeleteTopicUseCaseRequest): Promise<void> {
    await this.repository.deleteForever(topicId);

    return;
  }
}
