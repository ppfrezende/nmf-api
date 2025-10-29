import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';

interface GetUsersListUseCaseRequest {
  page: number;
}

interface GetUsersListUseCaseResponse {
  numberOfRegisters: string;
  totalCount: string;
  users: User[];
}

export class GetUsersListUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: GetUsersListUseCaseRequest): Promise<GetUsersListUseCaseResponse> {
    const users = await this.usersRepository.listMany(page);
    const allUsers = await this.usersRepository.listAll();

    users.map((user) => {
      user.password_hash = 'NON-for-ur-bussines';
      return user;
    });

    const numberOfRegisters = users.length.toString();
    const totalCount = allUsers.length.toString();

    return {
      users,
      numberOfRegisters,
      totalCount,
    };
  }
}
