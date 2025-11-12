import { Injectable } from '@nestjs/common';
import * as nestjsFirebase from 'nestjs-firebase';

@Injectable()
export class UserRepository {
  constructor(
    @nestjsFirebase.InjectFirebaseAdmin()
    private readonly firebase: nestjsFirebase.FirebaseAdmin,
  ) {}

  async findUserByEmail(
    email: string,
  ): Promise<{ id: string; email: string; password: string } | null> {
    const user = await this.firebase.firestore
      .collection(`users`)
      .where(`email`, `==`, email)
      .get();

    if (user.empty) {
      return null;
    }

    return {
      id: user.docs[0].id,
      email: user.docs[0].data().email as string,
      password: user.docs[0].data().password as string,
    };
  }

  async createUser(input: { email: string; password: string }): Promise<void> {
    await this.firebase.firestore.collection(`users`).add({
      email: input.email,
      password: input.password,
    });
  }
}
