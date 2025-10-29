import type { CyclesRepository } from '@/repositories/cycles-repository';

interface DeleteCycleUseCaseRequest {
  cycleId: string;
}

export class DeleteCycleUseCase {
  constructor(private repository: CyclesRepository) {}

  async execute({ cycleId }: DeleteCycleUseCaseRequest): Promise<void> {
    await this.repository.deleteForever(cycleId);

    return;
  }
}
