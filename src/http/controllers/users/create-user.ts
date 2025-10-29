import { ResourceAlreadyExists } from '@/use-cases/_errors/resource-already-exists';
import { makeCreateUserUseCase } from '@/use-cases/_factories/users-factories/make-create-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  // const roleValues = ['ADMIN', 'MEMBER'] as const;

  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    // role: z.enum(roleValues),
  });

  const { name, email, password } = createUserBodySchema.parse(request.body);

  try {
    const createUserUseCase = makeCreateUserUseCase();

    const { user } = await createUserUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (err) {
    if (err instanceof ResourceAlreadyExists) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
