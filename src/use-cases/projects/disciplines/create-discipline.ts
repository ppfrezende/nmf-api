import type { DisciplinesRepository } from '@/repositories/disciplines-repository';
import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';

interface CreateDisciplineUseCaseRequest {
  disciplines: {
    name: string;
    notes?: string;
  }[];
  projectId: string;
}

export class CreateDisciplineUseCase {
  constructor(private repository: DisciplinesRepository) {}

  async execute({ disciplines, projectId }: CreateDisciplineUseCaseRequest) {
    const result = await this.repository.create(disciplines, projectId);

    if (result.count < disciplines.length) {
      throw new ResourceAlreadyExists();
    }

    return;
  }
}
