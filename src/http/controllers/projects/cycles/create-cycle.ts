import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeCreateCycleUseCase } from '@/use-cases/_factories/project-factories/cycles-factories/make-create-cycle-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createCycle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCycleBodySchema = z.object({
    title: z.string(),
    notes: z.string().optional(),
  });

  const createCycleQuerySchema = z.object({
    projectId: z.string(),
  });

  const { title, notes } = createCycleBodySchema.parse(request.body);
  const { projectId } = createCycleQuerySchema.parse(request.params);

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

    const createCycleUseCase = makeCreateCycleUseCase();

    const { cycle } = await createCycleUseCase.execute({
      title,
      notes,
      projectId,
    });

    return reply.status(201).send(cycle);
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
