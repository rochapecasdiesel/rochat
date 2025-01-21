import fastify from 'fastify'
import { appRoutes } from './http/routes/app-routes'
import { ZodError } from 'zod'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'

export const app = fastify()

app.register(fastifyCors, {
  origin: true, // Aceita todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permitir credenciais (cookies)
})

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
