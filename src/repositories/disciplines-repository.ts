import type {
  DisciplinesStats,
  TotalDisciplinesStats,
} from '@/@types/disciplines-stats';
import { Prisma, type Discipline } from '@prisma/client';

export interface DisciplinesRepository {
  findById(disciplineId: string, projectId: string): Promise<Discipline | null>;
  create(
    data: Prisma.DisciplineCreateManyInput[],
    projectId: string,
  ): Promise<Prisma.BatchPayload>;
  update(
    id: string,
    data: Prisma.DisciplineUpdateInput,
  ): Promise<Discipline | null>;
  deleteForever(id: string): Promise<void | null>;
  getDisciplinesStatsByCycle(
    projectId: string,
    cycleId: string,
  ): Promise<DisciplinesStats[]>;
  getTotalDisciplinesStats(projectId: string): Promise<TotalDisciplinesStats[]>;
}
