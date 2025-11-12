import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(input: { email: string; password: string }): Promise<void> {
    const user = await this.userRepository.findUserByEmail(input.email);

    if (user) {
      throw new BadRequestException(`User already exists`);
    }

    const hashedPassword = await hash(input.password, 10);

    await this.userRepository.createUser({
      email: input.email,
      password: hashedPassword,
    });
  }
}
