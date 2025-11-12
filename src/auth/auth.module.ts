import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { InfraModule } from '../infra/infra.module';
import { AppConfigModule } from '../app-config/app-config.module';
import { EnvironmentService } from '../app-config/environment.service';

@Module({
  imports: [
    InfraModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          global: true,
          secret: environmentService.JWT_SECRET,
          signOptions: {
            expiresIn: environmentService.JWT_EXPIRES_IN as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
