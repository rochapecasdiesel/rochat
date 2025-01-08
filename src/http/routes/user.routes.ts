import { FastifyInstance } from 'fastify'
import { userRegisterController } from '../controllers/user-register.controller'
import { userUpdateController } from '../controllers/user-update.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', userRegisterController)
  app.patch('/:id', userUpdateController)
}
