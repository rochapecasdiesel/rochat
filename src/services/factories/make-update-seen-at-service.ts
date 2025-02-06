import { FirebaseChatRepository } from '@/repositories/firebase-repository/firebase-chat-repository'
import { UpdateSeenMessageService } from '../chat/update-seen-at.service'

export function makeUpdateSeenAtService() {
  const chatRepository = new FirebaseChatRepository()

  const updateSeenMessageService = new UpdateSeenMessageService(chatRepository)
  return updateSeenMessageService
}
