import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyCookie from '@fastify/cookie'
import { env } from './config/env'
import { Routes } from './infra/http/routes'

export const app = fastify()

app.register(fastifyCookie)
app.register(Routes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'validationError',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we should log to an external tool like dataDog/newReplic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
