import fastify from 'fastify'
import { z } from 'zod'
import { knex } from './database'
import crypto from 'node:crypto'
const app = fastify()

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

app.get('/users', async (req, reply) => {
  const users = await knex('users').select('id', 'email', 'name')
  return { users }
})

app.listen({ port: 3000 }).then(() => console.log('HTTP SERVER RUNNING'))
