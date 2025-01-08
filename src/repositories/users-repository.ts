import { User, UserCreateInput } from '@/@types/user'

export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
}
