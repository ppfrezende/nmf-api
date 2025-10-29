import type { ProjectsRepository } from '@/repositories/projects-repository';

interface DeleteUserProjectUseCaseRequest {
  projectId: string;
}

export class DeleteUserProjectUseCase {
  constructor(private repository: ProjectsRepository) {}

  async execute({ projectId }: DeleteUserProjectUseCaseRequest): Promise<void> {
    await this.repository.deleteForever(projectId);

    return;
  }
}
