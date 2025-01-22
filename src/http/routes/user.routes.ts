import { FastifyInstance } from 'fastify'
import { userRegisterController } from '../controllers/users/user-register.controller'
import { userUpdateController } from '../controllers/users/user-update.controller'
import { getManyUsersByNameController } from '../controllers/users/get-many-users-by-name.controller'
import { getUserChatsController } from '../controllers/users/get-user-chats.controller'
import { getUserByIdController } from '../controllers/users/get-user-by-id.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', userRegisterController)
  app.patch('/edit-user', userUpdateController)
  app.get('/', getManyUsersByNameController)
  app.get('/:id', getUserByIdController)
  app.get('/user-chats', getUserChatsController)
}
