import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetNotificationByIdService } from '@/services/factories/make-get-notification-by-id-service'

export async function getNotificationByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string(),
    notificationId: z.string(),
  })

  const { userId, notificationId } = paramsSchema.parse(request.params)
  const getNotificationByIdService = makeGetNotificationByIdService()

  try {
    const response = await getNotificationByIdService.execute(
      userId,
      notificationId,
    )
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
