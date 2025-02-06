import { PermissionDeniedError } from '@/services/erros/permission-denied-error'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeUpdateSeenAtService } from '@/services/factories/make-update-seen-at-service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSeenAtController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateSeenAtParamsSchema = z.object({
    chatId: z.string(),
  })

  const updateSeenAtBodySchema = z.object({
    messagesId: z.array(z.string()),
  })

  const { chatId } = updateSeenAtParamsSchema.parse(request.params)

  const { messagesId } = updateSeenAtBodySchema.parse(request.body)

  try {
    const updateSeenMessageService = makeUpdateSeenAtService()

    const message = await updateSeenMessageService.execute({
      chatId,
      messagesId,
      userId: request.user.sub,
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
