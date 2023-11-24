import { knex } from '../../database'
import { CreateInput, User, UsersRepository } from '../user'

export class MySqlUsersRepository implements UsersRepository {
  async create({ name, email, passwordHash }: CreateInput) {
    const user = await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: passwordHash,
    })
  }
}
