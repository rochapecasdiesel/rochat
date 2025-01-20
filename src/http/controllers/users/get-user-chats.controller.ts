import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetUserChatsService } from '@/services/factories/make-get-user-chats-service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getUserChatsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserChatsQuerySchema = z.object({
    page: z.coerce.number().default(1),
  })

  const { page } = getUserChatsQuerySchema.parse(request.query)

  const getUserChatsService = makeGetUserChatsService()

  try {
    const response = await getUserChatsService.execute({
      userId: request.user.sub,
      page,
    })
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(402).send({
        message: err.message,
      })
    }

    throw err
  }
}
