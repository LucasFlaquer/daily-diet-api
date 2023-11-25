import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../../database'
import { sign } from 'jsonwebtoken'
import { verifyToken } from '../../middlewares/verify-token'
import { UserController } from './controllers/UserController'

const userController = new UserController()

export async function Routes(app: FastifyInstance) {
  app.post('/register', userController.register)

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
    const comparedHashes = await compare(
      loginCredentials.password,
      user.password,
    )
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
      reply.status(201).send()
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
}
