import { Role, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { ResourceAlreadyExists } from '../_errors/resource-already-exists';
import type { UsersRepository } from '@/repositories/users-repository';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface CreateUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ResourceAlreadyExists();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
    });

    return {
      user,
    };
  }
}
