import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'

describe('Authenticate User', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate an user', async () => {
    const registerInput = {
      name: 'Lucas',
      email: 'lucas.flaquer@gmail.com',
      phone: '15988097161',
      password: '12345',
    }
    await request(app.server).post('/register').send(registerInput)
    const response = await request(app.server).post('/auth').send({
      email: registerInput.email,
      password: registerInput.password,
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('token='),
    ])
    expect(true).toBe(true)
  })
})
