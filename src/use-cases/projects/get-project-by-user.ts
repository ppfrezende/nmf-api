import type { ProjectsRepository } from '@/repositories/projects-repository';
import { type Project } from '@prisma/client';
import { ResourceNotFoundError } from '../_errors/resource-not-found-error';

interface GetProjectsByUserUseCaseRequest {
  projectId: string;
  userId: string;
}

interface GetProjectsByUserUseCaseResponse {
  project: Project | null;
}

export class GetProjectsByUserUseCase {
  constructor(private repository: ProjectsRepository) {}

  async execute({
    projectId,
    userId,
  }: GetProjectsByUserUseCaseRequest): Promise<GetProjectsByUserUseCaseResponse> {
    const project = await this.repository.findById(projectId, userId);

    if (!project) {
      throw new ResourceNotFoundError();
    }

    return { project };
  }
}
