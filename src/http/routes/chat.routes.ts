import { FastifyInstance } from 'fastify'
import { createNewController } from '../controllers/chats/create-new-chat.controller'
import { createNewMessageController } from '../controllers/chats/create-new-message.controller'
import { deleteMessageController } from '../controllers/chats/delete-message.controller'
import { updateMessageTextController } from '../controllers/chats/update-message-text.controller'
import { getMessagesController } from '../controllers/chats/get-messages.controller'
import { getChatByIdController } from '../controllers/chats/get-chat-by-id.controller'
import { updateSeenAtController } from '../controllers/chats/update-seen-at.controller'

export async function chatRoutes(app: FastifyInstance) {
  app.post('/', createNewController)
  app.post('/:chatId/message', createNewMessageController)
  app.patch('/:chatId/message/:messageId', updateMessageTextController)
  app.patch('/:chatId/seenAt', updateSeenAtController)
  app.delete('/:chatId/message/:messageId', deleteMessageController)
  app.get('/:chatId/messages', getMessagesController)
  app.get('/:chatId', getChatByIdController)
}
