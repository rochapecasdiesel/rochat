export interface User {
  id: string
  userName: string
  userMessage: string
  createdAt: Date
  updatedAt: Date
  avatarUrl: string
}

export interface UserCreateInput {
  id: string
  userName: string
  userMessage?: string
  createdAt?: Date
  updatedAt?: Date
  avatarUrl?: string
}

export interface UserUpdateInput extends Partial<User> {}
