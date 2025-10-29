import type { DisciplinesRepository } from '@/repositories/disciplines-repository';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { Prisma, type Discipline } from '@prisma/client';

interface UpdateDisciplineUseCaseRequest {
  projectId: string;
  disciplineId: string;
  data: Prisma.DisciplineUpdateInput;
}

interface UpdateDisciplineUseCaseResponse {
  updatedDiscipline: Discipline | null;
}

export class UpdateDisciplineUseCase {
  constructor(private repository: DisciplinesRepository) {}

  async execute({
    projectId,
    disciplineId,
    data,
  }: UpdateDisciplineUseCaseRequest): Promise<UpdateDisciplineUseCaseResponse> {
    const discipline = await this.repository.findById(disciplineId, projectId);

    if (!discipline) {
      throw new ResourceNotFoundError();
    }

    const updatedDiscipline = await this.repository.update(disciplineId, data);

    return {
      updatedDiscipline,
    };
  }
}
