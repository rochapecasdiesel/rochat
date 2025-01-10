interface UserChat {
  participantId: string[]
  lastMessage: string
  lastTimestamp: string
  assignedUser: 'assigned' | 'open'
}

export interface User {
  id: string
  userName: string
  userMessage: string
  createdAt: Date
  updatedAt: Date
  avatarUrl: string
  userChats?: UserChat[]
}

export interface UserCreateInput {
  id: string
  userName: string
  userMessage?: string
  createdAt?: Date
  updatedAt?: Date
  avatarUrl?: string
  userChats: UserChat[]
}

export interface UserUpdateInput extends Partial<User> {}
