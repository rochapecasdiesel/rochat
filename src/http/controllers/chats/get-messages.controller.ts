import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetMessagesService } from '@/services/factories/make-get-messages-service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getMessagesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMessageParamsSchema = z.object({
    chatId: z.string(),
  })

  const getMessagesQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
  })

  const { page } = getMessagesQuerySchema.parse(request.query)

  const { chatId } = getMessageParamsSchema.parse(request.params)

  try {
    const getMessageService = makeGetMessagesService()

    const messages = await getMessageService.execute({
      chatId,
      page,
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
