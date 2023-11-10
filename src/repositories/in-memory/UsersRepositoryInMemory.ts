import { randomUUID } from 'node:crypto'
import { CreateInput, UsersRepository, User } from '../user'

export class UsersRepositoryInMemory implements UsersRepository {
  items: User[] = []
  async create({ name, email, password_hash, phone }: CreateInput) {
    const user = { id: randomUUID(), name, email, password_hash, phone }
    this.items.push(user)
    return user
  }
}
