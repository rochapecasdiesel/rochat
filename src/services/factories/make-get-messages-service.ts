import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { GetMessagesService } from '../chat/get-messages.service'

export function makeGetMessagesService() {
  const chatRepository = new FirebaseChatRepository()
  const getMessagesService = new GetMessagesService(chatRepository)
  return getMessagesService
}
