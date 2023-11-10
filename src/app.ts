import fastify from 'fastify'
import { z } from 'zod'
import { knex } from './database'
import crypto from 'node:crypto'
export const app = fastify()

app.post('/register', async (req, reply) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string(),
  })
  const user = createUserSchema.parse(req.body)
  await knex('users').insert({
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    password: user.password,
  })
  return reply.status(201).send()
})

app.post('/auth', async (req, reply) => {
  const credentialsSchema = z.object({
    email: z.string(),
    password: z.string(),
  })
})

app.get('/users', async (req, reply) => {
  const users = await knex('users').select('id', 'email', 'name')
  return { users }
})
