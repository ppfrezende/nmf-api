import { Prisma, type Cycle } from '@prisma/client';

export interface CyclesRepository {
  findById(cycleId: string, projectId: string): Promise<Cycle | null>;
  create(data: Prisma.CycleCreateInput, projectId: string): Promise<Cycle>;
  update(id: string, data: Prisma.CycleUpdateInput): Promise<Cycle | null>;
  deleteForever(id: string): Promise<void | null>;
}
