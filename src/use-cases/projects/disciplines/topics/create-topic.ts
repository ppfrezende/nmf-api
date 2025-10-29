import type { TopicsRepository } from '@/repositories/topics-repository';
import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';

interface CreateTopicUseCaseRequest {
  topics: {
    title: string;
  }[];
  projectId: string;
  disciplineId: string;
}

export class CreateTopicUseCase {
  constructor(private repository: TopicsRepository) {}

  async execute({
    topics,
    projectId,
    disciplineId,
  }: CreateTopicUseCaseRequest) {
    const result = await this.repository.create(
      topics,
      projectId,
      disciplineId,
    );

    if (result.count < topics.length) {
      throw new ResourceAlreadyExists();
    }

    return;
  }
}
