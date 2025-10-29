import type { TotalDisciplinesStats } from '@/@types/disciplines-stats';
import type { DisciplinesRepository } from '@/repositories/disciplines-repository';

interface GetTotalDisciplinesStatsUseCaseRequest {
  projectId: string;
}

interface GetTotalDisciplinesStatsUseCaseResponse {
  disciplines: TotalDisciplinesStats[];
}

export class GetTotalDisciplinesStatsUseCase {
  constructor(private repository: DisciplinesRepository) {}

  async execute({
    projectId,
  }: GetTotalDisciplinesStatsUseCaseRequest): Promise<GetTotalDisciplinesStatsUseCaseResponse> {
    const disciplines = await this.repository.getTotalDisciplinesStats(
      projectId,
    );

    return { disciplines };
  }
}
