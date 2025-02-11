import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetUserNotificationsService } from '@/services/factories/make-get-notifications-service'

export async function getUserNotificationsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = paramsSchema.parse(request.params)
  const getUserNotificationsService = makeGetUserNotificationsService()

  try {
    const response = await getUserNotificationsService.execute(userId)
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
