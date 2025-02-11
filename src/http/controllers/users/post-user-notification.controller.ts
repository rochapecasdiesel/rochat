import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makePostUserNotificationService } from '@/services/factories/make-post-user-notification-service'

export async function postUserNotificationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string(),
  })

  // O schema NÃO inclui createdAt, pois ele será definido automaticamente
  const bodySchema = z.object({
    type: z.enum(['chat', 'order', 'generics']),
    title: z.string(),
    message: z.string(),
    timestamp: z.preprocess((arg) => new Date(arg as string), z.date()),
    createdAt: z
      .preprocess((arg) => new Date(arg as string), z.date())
      .default(new Date()),
    seen: z.boolean().default(false),
    seenAt: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date().optional(),
    ),
    details: z
      .object({
        chatId: z.string().optional(),
        messageId: z.string().optional(),
      })
      .optional(),
    notificationId: z.string().default(''),
  })

  const { userId } = paramsSchema.parse(request.params)
  const notificationData = bodySchema.parse(request.body)

  const postUserNotificationService = makePostUserNotificationService()

  try {
    const response = await postUserNotificationService.execute(
      userId,
      notificationData,
    )
    return reply.status(201).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
