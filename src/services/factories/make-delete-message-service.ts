import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { DeleteMessageService } from '../chat/delete-message.service'

export function makeDeleteMessageService() {
  const chatRepository = new FirebaseChatRepository()
  const deleteMessageService = new DeleteMessageService(chatRepository)
  return deleteMessageService
}
