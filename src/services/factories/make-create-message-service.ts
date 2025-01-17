import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { CreateMessageService } from '../chat/create-message.service'
import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'

export function makeCreateMessageService() {
  const chatRepository = new FirebaseChatRepository()
  const usersRepository = new FirebaseUsersRepository()
  const createMessageService = new CreateMessageService(
    chatRepository,
    usersRepository,
  )
  return createMessageService
}
