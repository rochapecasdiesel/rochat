import { PermissionDeniedError } from '@/services/erros/permission-denied-error'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeUpdateMessageTextService } from '@/services/factories/make-update-message-text-service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateMessageTextController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateMessageTextParamsSchema = z.object({
    chatId: z.string(),
    messageId: z.string().uuid(),
  })

  const updateMessageTextBodySchema = z.object({
    text: z.string().min(1),
  })

  const { chatId, messageId } = updateMessageTextParamsSchema.parse(
    request.params,
  )

  const { text } = updateMessageTextBodySchema.parse(request.body)

  try {
    const updateMessageTextService = makeUpdateMessageTextService()

    const message = await updateMessageTextService.execute({
      chatId,
      messageId,
      userId: request.user.sub,
      text,
    })

    return reply.status(201).send({ data: message })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        message: err.message,
      })
    }
    if (err instanceof PermissionDeniedError) {
      return reply.status(401).send({
        message: err.message,
      })
    }

    throw err
  }
}
