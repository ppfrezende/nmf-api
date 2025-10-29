import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeUpdateCycleUseCase } from '@/use-cases/_factories/project-factories/cycles-factories/make-update-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { Status } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateCycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCycleQuerySchema = z.object({
    cycleId: z.string(),
    projectId: z.string(),
  });
  const updateCycleBodySchema = z.object({
    title: z.string().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
  });
  const { cycleId, projectId } = updateCycleQuerySchema.parse(request.params);
  const { title, status, notes } = updateCycleBodySchema.parse(request.body);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const getProjectsByUserUseCase = makeGetProjectsByUserUseCase();

    await getProjectsByUserUseCase.execute({
      projectId,
      userId: user.id,
    });

    const updateCycleUseCase = makeUpdateCycleUseCase();

    await updateCycleUseCase.execute({
      cycleId,
      projectId,
      data: {
        title,
        status,
        notes,
      },
    });

    return reply.status(201).send({ message: 'successfully updated' });
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
