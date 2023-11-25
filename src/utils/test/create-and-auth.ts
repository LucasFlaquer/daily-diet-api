import { hash } from 'bcryptjs'
import { knex } from '../../database'
import request from 'supertest'
import { app } from '../../app'
import crypto from 'node:crypto'

export async function createAndAuthUser() {
  const createUser = {
    name: 'Lucas',
    email: 'lucas.flaquer@gmail.com',
    phone: '15988097161',
    password: '12345',
  }
  await knex('users').insert({
    name: 'Lucas',
    email: 'lucas.flaquer@gmail.com',
    password: await hash('12345', 6),
    id: crypto.randomUUID(),
  })

  const response = await request(app.server)
    .post('/auth')
    .send({ email: createUser.email, password: createUser.password })
  const cookies = response.headers['set-cookie']
  return cookies
}
