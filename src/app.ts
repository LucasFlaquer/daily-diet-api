import fastify from 'fastify'
import { z } from 'zod'
import { knex } from './database'
import crypto from 'node:crypto'
import { hash } from 'bcryptjs'
export const app = fastify()

app.post('/register', async (req, reply) => {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    password: z.string(),
  })
  const user = bodySchema.parse(req.body)
  const passwordHash = await hash(user.password, 6)
  await knex('users').insert({
    id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    password: passwordHash,
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
