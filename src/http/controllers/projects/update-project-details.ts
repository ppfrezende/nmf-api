import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeUpdateProjectUseCase } from '@/use-cases/_factories/project-factories/make-update-project-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { Status } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateProjectDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateProjectDetailsBodySchema = z.object({
    title: z.string().optional(),
    board: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
  });

  const { title, board, status } = updateProjectDetailsBodySchema.parse(
    request.body,
  );

  const updateProjectDetailsQuerySchema = z.object({
    projectId: z.string(),
  });

  const { projectId } = updateProjectDetailsQuerySchema.parse(request.params);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const updateProjectDetailsUseCase = makeUpdateProjectUseCase();

    await updateProjectDetailsUseCase.execute({
      projectId,
      userId: user.id,
      data: {
        title,
        board,
        status,
      },
    });

    return reply.status(201).send({ message: 'successfully updated' });
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
