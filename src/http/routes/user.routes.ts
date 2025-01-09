import { FastifyInstance } from 'fastify'
import { userRegisterController } from '../controllers/users/user-register.controller'
import { userUpdateController } from '../controllers/users/user-update.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', userRegisterController)
  app.patch('/', userUpdateController)
}
