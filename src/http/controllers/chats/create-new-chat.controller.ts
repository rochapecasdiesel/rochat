import { ChatAlreadyExist } from '@/services/erros/chat-already-exist-error'
import { ParticipantsWithSameId } from '@/services/erros/participants-with-same-id'
import { ResourceNotFoundError } from '@/services/erros/resource-not-found-error'
import { makeRegisterChatService } from '@/services/factories/make-register-chat-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNewController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const newChatBodySchema = z.object({
    participants: z.array(z.string()),
  })

  const { participants } = newChatBodySchema.parse(request.body)

  try {
    const registerChatService = makeRegisterChatService()

    const chat = await registerChatService.execute({
      participants: [request.user.sub, ...participants],
      assingnedUser: request.user.sub,
      status: 'assigned',
    })
    return reply.status(201).send({ data: chat })
  } catch (err) {
    if (err instanceof ChatAlreadyExist) {
      return reply.status(400).send({
        message: err.message,
        chatId: err.chat.id,
      })
    }

    if (err instanceof ParticipantsWithSameId) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
