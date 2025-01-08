import { FastifyInstance } from 'fastify'
import { userRegisterController } from '../controllers/user-register.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', userRegisterController)
}
