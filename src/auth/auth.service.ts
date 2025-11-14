import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const user = await this.userRepository.findUserByEmail(input.email);

    if (!user) {
      throw new BadRequestException(`User or password is incorrect`);
    }

    const isPasswordValid = await compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException(`User or password is incorrect`);
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
