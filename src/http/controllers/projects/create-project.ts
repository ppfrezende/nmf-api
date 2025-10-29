import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeCreateProjectUseCase } from '@/use-cases/_factories/project-factories/make-create-project-use-case';
import { makeGetUserUseCase } from '@/use-cases/_factories/users-factories/make-get-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createProject(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createProjectBodySchema = z.object({
    title: z.string(),
    board: z.string(),
  });

  const { title, board } = createProjectBodySchema.parse(request.body);

  try {
    const getUserUseCase = makeGetUserUseCase();

    const { user } = await getUserUseCase.execute({
      userId: request.user.sub,
    });

    const createProjectUseCase = makeCreateProjectUseCase();

    const { project } = await createProjectUseCase.execute({
      title,
      board,
      userId: user.id,
    });

    return reply.status(201).send(project);
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
