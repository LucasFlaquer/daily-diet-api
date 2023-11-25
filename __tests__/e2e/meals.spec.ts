import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { createAndAuthUser } from '../../src/utils/test/create-and-auth'

describe('Meals', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to add a meal to a user', async () => {
    const { cookies } = await createAndAuthUser()
    const mealInput = {
      name: 'rosquinha',
      description: 'a big meal',
      createdAt: '11-10-2020',
      inDiet: true,
    }
    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(mealInput)

    expect(response.statusCode).toBe(201)
    expect(true).toBe(true)
  })
})
