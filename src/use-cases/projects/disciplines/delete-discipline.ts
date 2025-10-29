import type { DisciplinesRepository } from '@/repositories/disciplines-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';

interface DeleteDisciplineUseCaseRequest {
  disciplineId: string;
  projectId: string;
}

export class DeleteDisciplineUseCase {
  constructor(private repository: DisciplinesRepository) {}

  async execute({ disciplineId, projectId }: DeleteDisciplineUseCaseRequest) {
    const discipline = await this.repository.findById(disciplineId, projectId);

    if (!discipline) {
      throw new ResourceNotFoundError();
    }

    await this.repository.deleteForever(disciplineId);

    return;
  }
}
