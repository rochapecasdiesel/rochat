import fastify from 'fastify'
import { appRoutes } from './http/routes/app-routes'

export const app = fastify()

// Registrando Rotas da aplicação
app.register(appRoutes)
