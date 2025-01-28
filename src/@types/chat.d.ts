export interface Alterations {
  id: string
  originalMessage: string
  timestamp: Date
  deleted: boolean
}

export interface Messages {
  id: string
  senderId: string
  text: string
  source: 'internal' | 'external'
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  altered: boolean
  alterations?: Alterations[]
}

export interface MessagesCreateInput {
  id?: string
  senderId: string
  text: string
  source: 'internal' | 'external'
  createdAt?: Date
  updatedAt?: Date
  deleted: boolean
  altered: boolean
  alterations?: Alterations[]
}

export interface MessagesUpdateInput extends Partial<Messages> {}

export interface Chat {
  id: string
  participants: string[]
  assingnedUser: string
  status: 'assigned' | 'open'
  createdAt: Date
  updatedAt: Date
  lastMessage: string
  lastTimestamp: Date
  messages: Messages[]
}

export interface ChatCreateInput {
  id?: string
  participants: string[]
  assingnedUser: string
  status: 'assigned' | 'open'
  createdAt?: Date
  updatedAt?: Date
  lastMessage?: string
  lastTimestamp?: Date
  messages?: Messages[]
}

export interface ChatUpdateInput extends Partial<Chat> {}
