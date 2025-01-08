import { db } from '@/lib/firebase'
import { UsersRepository } from '../users-repository'
import { User, UserCreateInput } from '@/@types/user'

export class FirebaseUsersRepository implements UsersRepository {
  private usersCollection = db.collection('users')

  async create(data: UserCreateInput) {
    const userRef = await this.usersCollection.add({
      userName: data.userName,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatarUrl: data.avatarUrl ?? null,
      userMessage: data.userMessage ?? null,
    })

    const userSnapshot = await userRef.get()
    const userData = userSnapshot.data()

    const user: User = {
      id: userRef.id,
      userName: userData?.userName ? userData.userName : null,
      userMessage: userData?.userMessage ? userData.userMessage : null,
      createdAt: userData?.createdAt ? userData.createdAt : null,
      updatedAt: userData?.updatedAt ? userData.updatedAt : null,
      avatarUrl: userData?.avatarUrl ? userData.avatarUrl : null,
    }

    return user
  }
}
