import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetNotSeenUserNotificationService } from '@/services/factories/make-get-not-seen-user-notifications-service'

export async function getNotSeenUserNotificationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = paramsSchema.parse(request.params)
  const getNotSeenUserNotificationService =
    makeGetNotSeenUserNotificationService()

  try {
    const response = await getNotSeenUserNotificationService.execute(userId)
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
