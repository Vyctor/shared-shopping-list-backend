import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get APP_PORT(): number {
    return this.configService.getOrThrow<number>('APP_PORT');
  }

  get JWT_SECRET(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  get JWT_EXPIRES_IN(): string {
    return this.configService.getOrThrow<string>('JWT_EXPIRES_IN');
  }
}
