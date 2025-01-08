import fastify from 'fastify'
import { appRoutes } from './http/routes/app-routes'
import { env } from 'process'
import { ZodError } from 'zod'

export const app = fastify()

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
