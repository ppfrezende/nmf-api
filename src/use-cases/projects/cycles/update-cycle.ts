import type { CyclesRepository } from '@/repositories/cycles-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { Prisma, type Cycle } from '@prisma/client';

interface UpdateCycleUseCaseRequest {
  cycleId: string;
  projectId: string;
  data: Prisma.CycleUpdateInput;
}

interface UpdateCycleUseCaseResponse {
  updatedCycle: Cycle | null;
}

export class UpdateCycleUseCase {
  constructor(private repository: CyclesRepository) {}

  async execute({
    cycleId,
    projectId,
    data,
  }: UpdateCycleUseCaseRequest): Promise<UpdateCycleUseCaseResponse> {
    const cycle = await this.repository.findById(cycleId, projectId);

    if (!cycle) {
      throw new ResourceNotFoundError();
    }

    const updatedCycle = await this.repository.update(cycleId, data);

    return {
      updatedCycle,
    };
  }
}
