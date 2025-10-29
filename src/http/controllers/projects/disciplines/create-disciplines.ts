import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { ResourceNotFoundError } from '@/use-cases/_errors/resource-not-found-error';
import { makeCreateDisciplineUseCase } from '@/use-cases/_factories/project-factories/discipline-factories/make-create-discipline-use-case';
import { makeGetProjectsByUserUseCase } from '@/use-cases/_factories/project-factories/make-get-project-by-user-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createDisciplines(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createDisciplinesQuerySchema = z.object({
    projectId: z.string(),
  });
  const createDisciplinesBodySchema = z.object({
    disciplines: z
      .array(
        z.object({
          name: z.string(),
          notes: z.string().optional(),
        }),
      )
      .nonempty('Precisa de pelo menos 1 disciplina'),
  });
  const { projectId } = createDisciplinesQuerySchema.parse(request.params);
  const { disciplines } = createDisciplinesBodySchema.parse(request.body);

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

    const createDisciplineUseCase = makeCreateDisciplineUseCase();

    await createDisciplineUseCase.execute({
      disciplines,
      projectId,
    });

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
