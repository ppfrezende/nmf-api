import { Project } from '@prisma/client';
import type { ProjectsRepository } from '@/repositories/projects-repository';

interface CreateProjectUseCaseRequest {
  title: string;
  board?: string;
  userId: string;
}

interface CreateProjectUseCaseResponse {
  project: Project;
}

export class CreateProjectUseCase {
  constructor(private repository: ProjectsRepository) {}

  async execute({
    title,
    board,
    userId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const project = await this.repository.create(
      {
        title,
        board,
      },
      userId,
    );

    return {
      project,
    };
  }
}
