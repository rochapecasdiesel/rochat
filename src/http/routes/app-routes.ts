import { FastifyInstance } from 'fastify'
import { userRoutes } from './user.routes'
import { verifyJwt } from '../middlewares/verify-jwt.middleware'

export async function appRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.register(userRoutes, {
    prefix: '/users',
  })
}
