import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeUpdateUserService } from '@/services/factories/make-update-user-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function userUpdateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserBodySchema = z.object({
    userName: z.string().optional(),
    userMessage: z.string().optional(),
    avatarUrl: z.string().optional(),
  })

  const updateUserParams = z.object({
    id: z.string(),
  })

  const { userName, userMessage, avatarUrl } = updateUserBodySchema.parse(
    request.body,
  )

  const { id } = updateUserParams.parse(request.params)

  const usersRepository = makeUpdateUserService()

  try {
    await usersRepository.execute(id, {
      avatarUrl,
      userMessage,
      userName,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(402).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(200).send()
}
