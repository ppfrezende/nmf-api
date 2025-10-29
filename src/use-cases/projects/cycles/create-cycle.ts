import type { CyclesRepository } from '@/repositories/cycles-repository';
import { type Cycle } from '@prisma/client';

interface CreateCycleUseCaseRequest {
  title: string;
  notes?: string;
  projectId: string;
}

interface CreateCycleUseCaseResponse {
  cycle: Cycle;
}

export class CreateCycleUseCase {
  constructor(private repository: CyclesRepository) {}

  async execute({
    title,
    notes,
    projectId,
  }: CreateCycleUseCaseRequest): Promise<CreateCycleUseCaseResponse> {
    const cycle = await this.repository.create(
      {
        title,
        notes,
      },
      projectId,
    );

    return {
      cycle,
    };
  }
}
