import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { DeleteMessageService } from '../chat/delete-message.service'
import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'

export function makeDeleteMessageService() {
  const chatRepository = new FirebaseChatRepository()
  const usersRepository = new FirebaseUsersRepository()
  const deleteMessageService = new DeleteMessageService(
    chatRepository,
    usersRepository,
  )
  return deleteMessageService
}
