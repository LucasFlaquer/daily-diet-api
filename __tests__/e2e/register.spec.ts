import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
describe('Create a user', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a user', async () => {
    const input = {
      name: 'Lucas',
      email: 'lucas.flaquer@gmail.com',
      phone: '15988097161',
      password: '12345',
    }
    const response = await request(app.server).post('/register').send(input)
    expect(response.statusCode).toBe(201)
    expect(true).toBe(true)
  })
})
