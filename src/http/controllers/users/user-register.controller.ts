import { UserAllreadyExistsError } from '@/services/erros/user-already-exists-error'
import { makeRegisterUserService } from '@/services/factories/make-register-user-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function userRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerUserBodySchema = z.object({
    userName: z.string(),
    userMessage: z.string().optional(),
    avatarUrl: z.string().optional(),
  })

  const { userName, userMessage, avatarUrl } = registerUserBodySchema.parse(
    request.body,
  )

  const usersRepository = makeRegisterUserService()

  try {
    await usersRepository.execute({
      avatarUrl,
      userMessage,
      userName,
      documentId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof UserAllreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
