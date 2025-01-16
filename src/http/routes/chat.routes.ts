import { FastifyInstance } from 'fastify'

export async function chatRoutes(app: FastifyInstance) {
  app.post('/', (_, reply) => reply.send('ok'))
}
