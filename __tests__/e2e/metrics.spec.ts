import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthUser } from '../../src/utils/test/create-and-auth'
import { app } from '../../src/app'
import { knex } from '../../src/database'
import { randomUUID } from 'node:crypto'

describe('Get Meals metrics', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get meals metrics', async () => {
    const { cookies, userId } = await createAndAuthUser()
    await knex('meals').insert({
      name: 'first',
      description: 'mealInput.description',
      created_at: new Date('11-10-2020'),
      on_diet: true,
      user_id: userId,
      id: randomUUID(),
    })
    await knex('meals').insert({
      name: 'second',
      description: 'mealInput.description',
      created_at: new Date('12-10-2020'),
      on_diet: false,
      user_id: userId,
      id: randomUUID(),
    })
    await knex('meals').insert({
      name: 'third',
      description: 'mealInput.description',
      created_at: new Date('13-10-2020'),
      on_diet: true,
      user_id: userId,
      id: randomUUID(),
    })
    await knex('meals').insert({
      name: 'fourth',
      description: 'mealInput.description',
      created_at: new Date('14-10-2020'),
      on_diet: true,
      user_id: userId,
      id: randomUUID(),
    })
    await knex('meals').insert({
      name: 'fifth',
      description: 'mealInput.description',
      created_at: new Date('15-10-2020'),
      on_diet: false,
      user_id: userId,
      id: randomUUID(),
    })
    const response = await request(app.server)
      .get('/metrics')
      .set('Cookie', cookies)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.totalMeals).toBe(5)
    expect(response.body.totalInDietMeals).toBe(3)
    expect(response.body.totalOutDietMeals).toBe(2)
    expect(response.body.bestSequence).toBe(2)
  })
})
