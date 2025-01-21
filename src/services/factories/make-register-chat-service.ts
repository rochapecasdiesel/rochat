import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { CreateChatService } from '../chat/register-chat.service'
import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'

export function makeRegisterChatService() {
  const chatRepository = new FirebaseChatRepository()
  const usersRepository = new FirebaseUsersRepository()
  const registerChatService = new CreateChatService(
    chatRepository,
    usersRepository,
  )

  return registerChatService
}
