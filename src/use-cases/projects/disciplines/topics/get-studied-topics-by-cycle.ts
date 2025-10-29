import type { TopicsRepository } from '@/repositories/topics-repository';
import type { Topic } from '@prisma/client';

interface GetStudiedTopicsByCycleUseCaseRequest {
  projectId: string;
  cycleId: string;
}

interface GetStudiedTopicsByCycleUseCaseResponse {
  studiedTopics: Topic[];
  unstudiedTopics: Topic[];
}

export class GetStudiedTopicsByCycleUseCase {
  constructor(private repository: TopicsRepository) {}

  async execute({
    projectId,
    cycleId,
  }: GetStudiedTopicsByCycleUseCaseRequest): Promise<GetStudiedTopicsByCycleUseCaseResponse> {
    const { studiedTopics, unstudiedTopics } =
      await this.repository.studiedTopicsByCycle(projectId, cycleId);

    return { studiedTopics, unstudiedTopics };
  }
}
