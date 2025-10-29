import { Prisma, Project } from '@prisma/client';

export interface ProjectsRepository {
  findById(id: string, userId: string): Promise<Project | null>;
  listMany(
    page: number,
    userId: string,
  ): Promise<{
    projects: Project[];
    total_count: number;
  }>;
  // searchMany(query: string, page: number): Promise<Project[]>;
  // listAllTrash(page: number): Promise<Project[]>;
  create(data: Prisma.ProjectCreateInput, userId: string): Promise<Project>;
  update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project | null>;
  deleteForever(projectId: string): Promise<void | null>;
}
