import { FastifyInstance } from 'fastify'
import { createNewController } from '../controllers/chats/create-new-chat.controller'
import { createNewMessageController } from '../controllers/chats/create-new-message.controller'

export async function chatRoutes(app: FastifyInstance) {
  app.post('/', createNewController)
  app.post('/:chatId/message', createNewMessageController)
}
