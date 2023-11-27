import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthUser } from '../../src/utils/test/create-and-auth'
import { app } from '../../src/app'
import { knex } from '../../src/database'
import { randomUUID } from 'node:crypto'

describe('Get one Meal', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get a meal by ID', async () => {
    const { cookies, userId } = await createAndAuthUser()
    const mealInput = {
      name: 'rosquinha',
      description: 'a big meal',
      createdAt: '11-10-2020',
      inDiet: true,
    }
    const [meal] = await knex('meals')
      .insert({
        name: mealInput.name,
        description: mealInput.description,
        created_at: new Date(mealInput.createdAt),
        on_diet: mealInput.inDiet,
        user_id: userId,
        id: randomUUID(),
      })
      .returning('id')
    const response = await request(app.server)
      .get(`/meals/${meal.id}`)
      .set('Cookie', cookies)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.meal).toEqual(
      expect.objectContaining({
        name: mealInput.name,
        description: mealInput.description,
      }),
    )
  })
})
