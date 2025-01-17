import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { UpdateMessageTextService } from '../chat/update-message-text.service'

export function makeUpdateMessageTextService() {
  const chatRepository = new FirebaseChatRepository()
  const updateMessageTextService = new UpdateMessageTextService(chatRepository)
  return updateMessageTextService
}
