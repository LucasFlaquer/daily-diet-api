import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { knex } from './database'
import crypto from 'node:crypto'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import fastifyCookie from '@fastify/cookie'
import { env } from './config/env'
import { verifyToken } from './middlewares/verify-token'

export const app = fastify()

app.register(fastifyCookie)
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
  const bodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })
  const loginCredentials = bodySchema.parse(req.body)
  const user = await knex('users')
    .where({ email: loginCredentials.email })
    .first()

  if (!user) throw new Error('Invalid Credentials')
  console.log(user)
  const comparedHashes = await compare(loginCredentials.password, user.password)
  if (!comparedHashes) throw new Error('Invalid Credentials')
  const sessionToken = sign(
    {
      sub: user.id,
      name: user.name,
      expires_in: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    'SUPER_SECRET',
    { expiresIn: '1m' },
  )
  reply.setCookie('token', sessionToken)
  return reply.send()
})

app.get('/users', async (req, reply) => {
  const users = await knex('users').select('id', 'email', 'name')
  return { users }
})

app.post(
  '/meals',
  {
    onRequest: [verifyToken],
  },
  async (req, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      createdAt: z.coerce.date(),
      inDiet: z.boolean(),
    })
    const data = bodySchema.parse(req.body)
    await knex('meals').insert({
      name: data.name,
      description: data.description,
      created_at: data.createdAt,
      on_diet: data.inDiet,
      user_id: req.user,
      id: crypto.randomUUID(),
    })
    reply.send({ message: 'done' })
  },
)

app.get('/meals', { onRequest: [verifyToken] }, async (req, res) => {
  const meals = await knex('meals')
    .select('*')
    .where('user_id', '=', `${req.user}`)
  res.send(meals)
})
app.get('/meals/:id', { onRequest: [verifyToken] }, async (req, reply) => {
  const paramSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramSchema.parse(req.params)
  const meal = await knex('meals').select('*').where('id', '=', id).first()
  reply.send({ meal })
})
app.delete('/meals/:id', { onRequest: [verifyToken] }, async (req, reply) => {
  const paramSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = paramSchema.parse(req.params)
  await knex('meals').delete().where('id', '=', id)
  reply.status(204).send()
})

app.get('/metrics', { onRequest: [verifyToken] }, async (req, reply) => {
  const meals = await knex('meals')
    .orderBy('created_at')
    .where('id', '=', `${req.user}`)
  let inDietMeals = 0
  let outOfDietMeals = 0
  let bestSequence = 0
  let sequence = 0

  meals.forEach((meal) => {
    if (!meal.on_diet) {
      outOfDietMeals++
      bestSequence = sequence >= bestSequence ? sequence : bestSequence
      sequence = 0
      return
    }
    inDietMeals++
    sequence++
  })

  reply.send({
    totalMeals: meals.length,
    totalInDietMeals: inDietMeals,
    totalOutDietMeals: outOfDietMeals,
    bestSequence,
  })
})

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
