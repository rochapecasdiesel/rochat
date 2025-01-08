import { makeRegisterUserService } from '@/services/factories/make-register-user-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function userRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerUserBodoySchema = z.object({
    userName: z.string(),
    userMessage: z.string().optional(),
    avatarUrl: z.string().optional(),
  })

  const { userName, userMessage, avatarUrl } = registerUserBodoySchema.parse(
    request.body,
  )

  const usersRepository = makeRegisterUserService()

  await usersRepository.execute({
    avatarUrl,
    userMessage,
    userName,
  })

  return reply.status(201).send()
}
