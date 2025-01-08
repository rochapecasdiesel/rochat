import { db } from '@/lib/firebase'
import { UsersRepository } from '../users-repository'
import { User, UserCreateInput } from '@/@types/user'

export class FirebaseUsersRepository implements UsersRepository {
  private usersCollection = db.collection('users')

  async create(data: UserCreateInput): Promise<User> {
    const id = data.id

    const documentData = {
      userName: data.userName,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userMessage: data.userMessage ?? null,
    }

    // Cria o documento com o ID fornecido
    const docRef = this.usersCollection.doc(id)
    await docRef.set(documentData)

    const user = {
      id,
      ...documentData,
    } as User

    // Retorna o documento criado com o ID
    return user
  }

  async findById(id: string): Promise<User | null> {
    const userRef = this.usersCollection.doc(id)

    const userSnapshot = await userRef.get()

    const userData = userSnapshot.data()
    if (!userData) {
      return null
    }

    const user: User = {
      id: userSnapshot.id,
      userName: userData?.userName ? userData.userName : null,
      userMessage: userData?.userMessage ? userData.userMessage : null,
      createdAt: userData?.createdAt ? userData.createdAt : null,
      updatedAt: userData?.updatedAt ? userData.updatedAt : null,
      avatarUrl: userData?.avatarUrl ? userData.avatarUrl : null,
    }

    return user
  }
}
