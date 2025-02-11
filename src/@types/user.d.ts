interface UserChat {
  participantId: string[]
  lastMessage: string
  chatId: string
  lastTimestamp: Date
  assignedUser: 'assigned' | 'open'
  id: string
}

export interface UserNotification {
  notificationId: string
  type: 'chat' | 'order' | 'generics'
  title: string
  message: string
  timestamp: Date
  createdAt: Date
  seen: boolean
  seenAt?: Date
  details?: {
    chatId?: string
    messageId?: string
  }
}

export interface User {
  id: string
  userName: string
  userMessage: string
  createdAt: Date
  updatedAt: Date
  avatarUrl: string
  userChats?: UserChat[]
  userNotifications?: UserNotification[]
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
