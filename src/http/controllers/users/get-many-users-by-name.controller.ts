import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeGetManyUsersByNameService } from '@/services/factories/make-get-many-user-by-name-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getManyUsersByNameController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getManyUsersByNameScheemaQuery = z.object({
    q: z.string().optional(),
  })

  const { q } = getManyUsersByNameScheemaQuery.parse(request.query)

  const getManyUsersByNameService = makeGetManyUsersByNameService()

  try {
    const response = await getManyUsersByNameService.execute(q || '')
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
