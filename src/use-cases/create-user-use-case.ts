import { UsersRepository } from '../repositories/user'
import { hash } from 'bcryptjs'

interface Input {
  name: string
  email: string
  password: string
  phone: string
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(input: Input) {
    const passwordHash = await hash(input.password, 6)
    const user = await this.usersRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password_hash: passwordHash,
    })
    return { user }
  }
}
