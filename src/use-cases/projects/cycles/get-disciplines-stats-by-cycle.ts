import type { DisciplinesStats } from '@/@types/disciplines-stats';
import type { DisciplinesRepository } from '@/repositories/disciplines-repository';

interface GetDisciplinesStatsByCycleUseCaseRequest {
  projectId: string;
  cycleId: string;
}

interface GetDisciplinesStatsByCycleUseCaseResponse {
  disciplines: DisciplinesStats[];
}

export class GetDisciplinesStatsByCycleUseCase {
  constructor(private repository: DisciplinesRepository) {}

  async execute({
    projectId,
    cycleId,
  }: GetDisciplinesStatsByCycleUseCaseRequest): Promise<GetDisciplinesStatsByCycleUseCaseResponse> {
    const disciplines = await this.repository.getDisciplinesStatsByCycle(
      projectId,
      cycleId,
    );

    return { disciplines };
  }
}
