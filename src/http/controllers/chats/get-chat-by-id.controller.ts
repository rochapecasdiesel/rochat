import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetChatByIdService } from '@/services/factories/make-get-chat-by-name-service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getChatByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getChatByIdParamsSchema = z.object({
    chatId: z.string(),
  })

  const { chatId } = getChatByIdParamsSchema.parse(request.params)

  try {
    const getChatById = makeGetChatByIdService()

    const messages = await getChatById.execute({
      chatId,
    })

    return reply.status(200).send({ data: messages })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        message: err.message,
      })
    }
    throw err
  }
}
