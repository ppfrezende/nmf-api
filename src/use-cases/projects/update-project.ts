import { Project, Prisma } from '@prisma/client';
import type { ProjectsRepository } from '@/repositories/projects-repository';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface UpdateProjectUseCaseRequest {
  projectId: string;
  userId: string;
  data: Prisma.ProjectUpdateInput;
}

interface UpdateProjectUseCaseResponse {
  updatedProject: Project | null;
}

export class UpdateProjectUseCase {
  constructor(private repository: ProjectsRepository) {}

  async execute({
    projectId,
    userId,
    data,
  }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const project = await this.repository.findById(projectId, userId);

    if (!project) {
      throw new ResourceNotFoundError();
    }

    const updatedProject = await this.repository.update(projectId, data);

    return {
      updatedProject,
    };
  }
}
