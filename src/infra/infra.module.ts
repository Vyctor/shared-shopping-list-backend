import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      googleApplicationCredential: './src/app-config/firebase-config.json',
    }),
  ],
  exports: [FirebaseModule],
})
export class InfraModule {}
