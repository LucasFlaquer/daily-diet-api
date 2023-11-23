export interface CreateInput {
  name: string
  email: string
  passwordHash: string
  phone: string
}

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  phone: string
}

export interface UsersRepository {
  create({ name, email, password_hash, phone }: CreateInput): Promise<User>
}
