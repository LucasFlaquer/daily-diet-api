import { MySqlUsersRepository } from '../../repositories/my-sql/my-sql-users-repository'
import { CreateUserUseCase } from '../create-user-use-case'

export function makeUserUseCase() {
  const usersRepository = new MySqlUsersRepository()
  const useCase = new CreateUserUseCase(usersRepository)
  return useCase
}
