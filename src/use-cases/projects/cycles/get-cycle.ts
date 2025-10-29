import type { CyclesRepository } from '@/repositories/cycles-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { type Cycle } from '@prisma/client';

interface GetCycleUseCaseRequest {
  cycleId: string;
  projectId: string;
}

interface GetCycleUseCaseResponse {
  cycle: Cycle | null;
}

export class GetCycleUseCase {
  constructor(private repository: CyclesRepository) {}

  async execute({
    cycleId,
    projectId,
  }: GetCycleUseCaseRequest): Promise<GetCycleUseCaseResponse> {
    const cycle = await this.repository.findById(cycleId, projectId);

    if (!cycle) {
      throw new ResourceNotFoundError();
    }

    return { cycle };
  }
}
