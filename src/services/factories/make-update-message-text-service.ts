import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { UpdateMessageTextService } from '../chat/update-message-text.service'
import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'

export function makeUpdateMessageTextService() {
  const chatRepository = new FirebaseChatRepository()
  const usersRepository = new FirebaseUsersRepository()
  const updateMessageTextService = new UpdateMessageTextService(
    chatRepository,
    usersRepository,
  )
  return updateMessageTextService
}
