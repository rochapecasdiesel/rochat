import { User, UserCreateInput, UserUpdateInput } from '@/@types/user'

export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  update(id: string, data: UserUpdateInput): Promise<User>
}
