import { beforeEach, describe, expect, it } from 'vitest'
import { UsersRepository } from '../../src/repositories/user'
import { CreateUserUseCase } from '../../src/use-cases/create-user-use-case'
import { UsersRepositoryInMemory } from '../../src/repositories/in-memory/UsersRepositoryInMemory'
import { compare } from 'bcryptjs'

let usersRepository: UsersRepository
let createUserUseCase: CreateUserUseCase

describe('CreateUser Use Case', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })
  it('should be able to create a user', async () => {
    const input = {
      name: 'Jhon Doe',
      email: 'test@test.com',
      phone: '15900000000',
      password: '12345',
    }
    const { user } = await createUserUseCase.execute(input)
    const passwordMatches = await compare('12345', user.password_hash)
    expect(passwordMatches).toBeTruthy()
  })
})
