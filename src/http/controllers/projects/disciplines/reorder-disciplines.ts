import { prisma } from '@/lib/prisma';
import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function reorderDisciplines(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const reorderDisciplinesQuerySchema = z.object({
    projectId: z.string(),
  });
  const reorderDisciplinesBodySchema = z.object({
    orderedIds: z.array(z.string().cuid()).min(1),
  });
  const { projectId } = reorderDisciplinesQuerySchema.parse(request.params);
  const { orderedIds } = reorderDisciplinesBodySchema.parse(request.body);

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

    const found = await prisma.discipline.findMany({
      where: { id: { in: orderedIds }, projectId },
      select: { id: true },
    });

    if (found.length !== orderedIds.length) {
      return reply
        .code(400)
        .send({ error: 'Some ids do not belong to this project' });
    }

    const updates = orderedIds.map((id, idx) =>
      prisma.discipline.update({
        where: { id },
        data: { position: idx + 1 },
      }),
    );

    await prisma.$transaction(updates);

    return reply.status(201).send();
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
