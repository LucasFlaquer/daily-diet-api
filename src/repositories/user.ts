export interface CreateInput {
  name: string
  email: string
  passwordHash: string
}

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
}

export interface UsersRepository {
  create({ name, email, passwordHash }: CreateInput): Promise<void>
}
