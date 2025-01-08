import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.get('/hello', async (request, reply) => {
    return reply.send({ hello: 'world' })
  })
}
