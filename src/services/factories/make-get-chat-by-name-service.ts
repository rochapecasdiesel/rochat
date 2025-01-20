import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { GetChatByIdService } from '../chat/get-chat-by-id.service'

export function makeGetChatByIdService() {
  const chatRepository = new FirebaseChatRepository()
  const getMessagesService = new GetChatByIdService(chatRepository)
  return getMessagesService
}
