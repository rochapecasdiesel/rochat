import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeMarkNotificationAsSeenService } from '@/services/factories/make-mark-notification-as-seen-service'

export async function markNotificationAsSeenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string(),
    notificationId: z.string(),
  })

  const bodySchema = z.object({
    seenAt: z.preprocess((arg) => new Date(arg as string), z.date()),
  })

  const { userId, notificationId } = paramsSchema.parse(request.params)
  const { seenAt } = bodySchema.parse(request.body)
  console.log('merda')

  const markNotificationAsSeenService = makeMarkNotificationAsSeenService()

  try {
    const response = await markNotificationAsSeenService.execute(
      userId,
      notificationId,
      seenAt,
    )
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
