import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeCreateMessageService } from '@/services/factories/make-create-message-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewMessageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newMessageBodySchema = z.object({
    source: z.enum(['external', 'internal']),
    text: z.string(),
    replyTo: z.string().uuid().optional(),
  })

  const newMessageParamsSchema = z.object({
    chatId: z.string(),
  })

  const { chatId } = newMessageParamsSchema.parse(request.params)

  const { source, text, replyTo } = newMessageBodySchema.parse(request.body)

  try {
    const createMessageService = makeCreateMessageService()

    const message = await createMessageService.execute({
      altered: false,
      chatId,
      deleted: false,
      source,
      senderId: request.user.sub,
      text,
      replyTo,
    })

    return reply.status(201).send({ data: message })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
