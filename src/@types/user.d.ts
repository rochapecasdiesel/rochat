import { Timestamp } from 'firebase-admin/firestore'

interface UserChat {
  participantId: string[]
  lastMessage: string
  chatId: string
  lastTimestamp: Date
  assignedUser: 'assigned' | 'open'
  id: string
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
  userChats?: UserChat[]
}

export interface UserUpdateInput extends Partial<User> {}
export interface UserChatUpdate extends Partial<UserChat> {}
