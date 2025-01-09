import fastify from 'fastify'
import { appRoutes } from './http/routes/app-routes'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'

export const app = fastify()

// Registrando o fastify-jwt
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Registrando Rotas da aplicação
app.register(appRoutes)

// Validação de erros de forma global
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO fazer um log
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
