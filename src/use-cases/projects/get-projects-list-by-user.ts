import type { ProjectsRepository } from '@/repositories/projects-repository';
import { type Project } from '@prisma/client';

interface GetProjectsListByUserUseCaseRequest {
  page: number;
  userId: string;
}

interface GetProjectsListByUserUseCaseResponse {
  registersPerPage: string;
  total_count: number;
  projects: Project[];
}

export class GetProjectsListByUserUseCase {
  constructor(private repository: ProjectsRepository) {}

  async execute({
    page,
    userId,
  }: GetProjectsListByUserUseCaseRequest): Promise<GetProjectsListByUserUseCaseResponse> {
    const { projects, total_count } = await this.repository.listMany(
      page,
      userId,
    );

    const registersPerPage = projects.length.toString();

    return {
      projects,
      registersPerPage,
      total_count,
    };
  }
}
