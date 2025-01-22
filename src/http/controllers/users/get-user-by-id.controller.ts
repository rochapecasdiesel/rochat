import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetUserByIdService } from '@/services/factories/make-get-user-by-id-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getUserByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserByIdParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getUserByIdParamsSchema.parse(request.params)

  const getUserById = makeGetUserByIdService()

  try {
    const response = await getUserById.execute(id)
    return reply.status(200).send({ data: response })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(402).send({
        message: err.message,
      })
    }

    throw err
  }
}
